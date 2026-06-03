"""
WebSocket proxy — forward WebSocket connections through the server.

Supports proxying WebSocket connections to external services and local ports.
Used for AI chat windows and other real-time applications.

Usage:
  Frontend connects to: ws://server/api/ws-proxy?url=wss://example.com/ws
  Server forwards to:   wss://example.com/ws
"""

import websocket
import threading
from flask import request
from flask_sock import Sock

# Will be initialized with the Flask app
sock = None


def init_ws_proxy(flask_app):
    """Initialize WebSocket proxy with the Flask app."""
    global sock
    sock = Sock(flask_app)

    @sock.route('/api/ws-proxy')
    def ws_proxy(ws):
        """
        WebSocket proxy endpoint.

        Query params:
          url: target WebSocket URL (e.g. wss://example.com/ws or ws://127.0.0.1:3000/ws)
        """
        target_url = request.args.get('url', '')
        if not target_url:
            ws.send('{"error": "Missing url parameter"}')
            ws.close()
            return

        # Resolve local:PORT to ws://127.0.0.1:PORT
        if target_url.startswith('local:'):
            rest = target_url[len('local:'):]
            target_url = f'ws://127.0.0.1/{rest}'

        # Add scheme if missing
        if not target_url.startswith(('ws://', 'wss://')):
            target_url = f'wss://{target_url}'

        # Connect to target WebSocket
        try:
            target_ws = websocket.create_connection(
                target_url,
                timeout=10,
                skip_utf8_validation=True,
            )
        except Exception as e:
            ws.send(f'{{"error": "Failed to connect to target: {str(e)}"}}')
            ws.close()
            return

        # Bidirectional forwarding
        def forward(source, dest):
            """Forward messages from source to dest."""
            try:
                while True:
                    message = source.recv()
                    if message is None:
                        break
                    dest.send(message, binary=isinstance(message, bytes))
            except Exception:
                pass
            finally:
                try:
                    dest.close()
                except Exception:
                    pass

        # Start forwarding threads
        t1 = threading.Thread(target=forward, args=(ws, target_ws), daemon=True)
        t2 = threading.Thread(target=forward, args=(target_ws, ws), daemon=True)
        t1.start()
        t2.start()

        # Wait for either thread to finish
        t1.join()
        t2.join()
