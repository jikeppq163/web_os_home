from flask import Flask, send_from_directory
from flask_cors import CORS
from app.routes.apps import apps_bp
from app.routes.notes import notes_bp
from app.routes.auth import auth_bp
from app.routes.proxy_routes import proxy_bp
from app.routes.ws_proxy import init_ws_proxy
from app.db import init_db
import os

app = Flask(__name__, static_folder=None)
CORS(app)

# 初始化数据库
init_db()

# Register blueprints
app.register_blueprint(apps_bp, url_prefix='/api')
app.register_blueprint(notes_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(proxy_bp, url_prefix='/api')

# Initialize WebSocket proxy
init_ws_proxy(app)

# 前端 dist 目录路径
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'dist')
# AI 生成的静态应用托管目录（由 os-home-mcp 的 deploy_static 写入）
STATIC_APPS_DIR = os.path.join(os.path.dirname(__file__), 'static_apps')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """托管前端静态资源，支持 SPA 路由回退"""
    if path and os.path.exists(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    # SPA 路由回退到 index.html
    return send_from_directory(DIST_DIR, 'index.html')

@app.route('/static_apps/<path:filename>')
def serve_static_app(filename):
    """托管 AI 生成的静态应用（同源，无需代理，可直接 iframe 嵌入）"""
    return send_from_directory(STATIC_APPS_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5100)