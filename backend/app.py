from flask import Flask
from flask_cors import CORS
from app.routes.apps import apps_bp
from app.routes.notes import notes_bp
from app.routes.auth import auth_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(apps_bp, url_prefix='/api')
app.register_blueprint(notes_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5100)