"""
Proxy routes — HTTP proxy for external and local services.

Supports:
- External websites (bypass X-Frame-Options, CSP, etc.)
- Local 127.0.0.1 services (e.g. AI chat on localhost:3000)
- GET / POST / PUT / DELETE forwarding
- Response header filtering (remove blocking headers)
- URL rewriting for relative links in HTML responses
"""

import re
import requests
from flask import Blueprint, request, Response, jsonify
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

proxy_bp = Blueprint('proxy', __name__)

# Headers to strip from proxied responses so they can be embedded in iframes
BLOCKING_HEADERS = {
    'x-frame-options',
    'content-security-policy',
    'x-content-security-policy',
    'x-webkit-csp',
    'frame-options',
    'x-xss-protection',
}

# Headers to forward from the original request
FORWARD_HEADERS = {
    'user-agent',
    'accept',
    'accept-language',
    'accept-encoding',
    'cookie',
    'referer',
    'origin',
    'content-type',
    'authorization',
}


def _build_target_url(target: str) -> str:
    """
    Resolve the target URL.
    Supports:
      - Full URLs: https://example.com/page
      - Local services: local:3000/path  →  http://127.0.0.1:3000/path
      - Short host: github.com  →  https://github.com
    """
    if target.startswith('local:'):
        # local:PORT/path → http://127.0.0.1:PORT/path
        rest = target[len('local:'):]
        return f'http://127.0.0.1/{rest}'

    if target.startswith('http://') or target.startswith('https://'):
        return target

    # No scheme — default to https
    return f'https://{target}'


def _filter_response_headers(headers: dict) -> dict:
    """Remove headers that prevent iframe embedding."""
    return {
        k: v for k, v in headers.items()
        if k.lower() not in BLOCKING_HEADERS
    }


def _rewrite_html(html: str, base_url: str, proxy_prefix: str) -> str:
    """
    Rewrite relative URLs in HTML so they go through the proxy.
    Handles: <a href>, <img src>, <link href>, <script src>, <form action>,
             CSS url(), <source src>, <iframe src>
    """
    try:
        soup = BeautifulSoup(html, 'html.parser')
    except Exception:
        return html

    # Attributes that contain URLs
    url_attrs = {
        'a': ['href'],
        'img': ['src'],
        'link': ['href'],
        'script': ['src'],
        'form': ['action'],
        'iframe': ['src'],
        'source': ['src'],
        'video': ['src'],
        'audio': ['src'],
    }

    for tag_name, attrs in url_attrs.items():
        for tag in soup.find_all(tag_name):
            for attr in attrs:
                if tag.has_attr(attr):
                    val = tag[attr]
                    # Skip data URIs, javascript:, mailto:, tel:, anchors
                    if val.startswith(('data:', 'javascript:', 'mailto:', 'tel:', '#')):
                        continue
                    # Skip absolute URLs that are already proxied
                    if val.startswith(proxy_prefix):
                        continue
                    # Resolve relative URL
                    resolved = urljoin(base_url, val)
                    tag[attr] = f'{proxy_prefix}{resolved}'

    # Rewrite CSS url() references
    for style_tag in soup.find_all('style'):
        if style_tag.string:
            style_tag.string = _rewrite_css_urls(style_tag.string, base_url, proxy_prefix)

    for tag in soup.find_all(style=True):
        tag['style'] = _rewrite_css_urls(tag['style'], base_url, proxy_prefix)

    # Inject <base> tag as fallback
    if soup.head:
        existing_base = soup.head.find('base')
        if not existing_base:
            base_tag = soup.new_tag('base', href=base_url)
            soup.head.insert(0, base_tag)

    return str(soup)


def _rewrite_css_urls(css: str, base_url: str, proxy_prefix: str) -> str:
    """Rewrite url() references in CSS."""
    def replacer(match):
        url_val = match.group(1).strip().strip("'\"")
        if url_val.startswith(('data:', 'http://', 'https://', proxy_prefix)):
            return match.group(0)
        resolved = urljoin(base_url, url_val)
        return f'url("{proxy_prefix}{resolved}")'

    return re.sub(r'url\(\s*([^\)]+)\s*\)', replacer, css)


def _proxy_request(method: str, target: str) -> Response:
    """Core proxy logic — forward request and return filtered response."""
    target_url = _build_target_url(target)

    # Build headers to forward
    fwd_headers = {}
    for h, v in request.headers:
        if h.lower() in FORWARD_HEADERS:
            fwd_headers[h] = v

    # Don't forward Content-Length — requests lib handles it
    fwd_headers.pop('content-length', None)
    fwd_headers.pop('host', None)

    try:
        resp = requests.request(
            method=method,
            url=target_url,
            headers=fwd_headers,
            data=request.get_data(),
            params=request.args,
            allow_redirects=False,
            timeout=30,
            verify=True,
        )
    except requests.exceptions.SSLError:
        # Retry without SSL verification for self-signed certs
        try:
            resp = requests.request(
                method=method,
                url=target_url,
                headers=fwd_headers,
                data=request.get_data(),
                params=request.args,
                allow_redirects=False,
                timeout=30,
                verify=False,
            )
        except Exception as e:
            return jsonify({'error': str(e)}), 502
    except Exception as e:
        return jsonify({'error': str(e)}), 502

    # Handle redirects through proxy
    if resp.status_code in (301, 302, 303, 307, 308):
        location = resp.headers.get('location', '')
        if location:
            # Rewrite redirect to go through proxy
            if not location.startswith(('http://', 'https://')):
                location = urljoin(target_url, location)
            proxy_prefix = f'/api/proxy/'
            new_location = f'{proxy_prefix}{location}'
            return Response(status=resp.status_code, headers={'Location': new_location})

    # Filter blocking headers
    resp_headers = _filter_response_headers(dict(resp.headers))

    # Rewrite HTML responses
    content_type = resp.headers.get('content-type', '')
    body = resp.content

    if 'text/html' in content_type:
        try:
            html = body.decode('utf-8', errors='replace')
            proxy_prefix = f'/api/proxy/'
            html = _rewrite_html(html, target_url, proxy_prefix)
            body = html.encode('utf-8')
        except Exception:
            pass  # Fall through to raw content

    # Build response
    flask_resp = Response(
        body,
        status=resp.status_code,
        headers=resp_headers,
    )

    return flask_resp


# --- Routes ---

@proxy_bp.route('/proxy/<path:target>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
def proxy(target: str):
    """
    Proxy endpoint.

    Usage:
      GET  /api/proxy/https://example.com
      GET  /api/proxy/local:3000/chat        → proxies to http://127.0.0.1:3000/chat
      POST /api/proxy/https://api.example.com/data
    """
    return _proxy_request(request.method, target)


@proxy_bp.route('/proxy', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'])
def proxy_query():
    """
    Proxy endpoint with URL as query parameter.

    Usage:
      GET  /api/proxy?url=https://example.com
      GET  /api/proxy?url=local:3000/chat
    """
    target = request.args.get('url', '')
    if not target:
        return jsonify({'error': 'Missing url parameter'}), 400
    return _proxy_request(request.method, target)


@proxy_bp.route('/proxy/resolve', methods=['GET'])
def proxy_resolve():
    """
    Resolve a relative URL against a base URL through the proxy.
    Used by the frontend to convert relative links to proxy URLs.

    Query params:
      base: base URL (e.g. https://example.com)
      path: relative path (e.g. /page/subpage)
    """
    base = request.args.get('base', '')
    path = request.args.get('path', '')
    if not base or not path:
        return jsonify({'error': 'Missing base or path parameter'}), 400

    resolved = urljoin(base, path)
    proxy_url = f'/api/proxy/{resolved}'
    return jsonify({'proxy_url': proxy_url})
