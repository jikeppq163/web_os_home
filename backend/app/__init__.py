from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 创建 Flask 应用实例
app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 导入路由
from app.routes import app_routes