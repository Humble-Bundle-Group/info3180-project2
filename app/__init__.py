from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from .config import Config

app = Flask(__name__)
db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

csrf = CSRFProtect(app)

app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://zsngvxoqbtqsty:5eba491592d14609ff444a08c7271830f8cd91af4af3f2826b749f361e697eee@ec2-52-87-107-83.compute-1.amazonaws.com:5432/ddsaqtc5kgrl0c'
from app import views