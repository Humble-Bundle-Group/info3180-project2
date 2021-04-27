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
app.config['SQLALCHEMY_DATABASE_URI'] = 'qanljzjqnupgxj:b43f7bf6db741b33083e5e0eb6dd37a5e272e41064685dc43552e755cf0c9695@ec2-3-234-85-177.compute-1.amazonaws.com:5432/d36qf35btbhibq'
app.config.from_object(Config)

from app import views