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
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://oiguqlhppndfnu:532fd265fd989e6d22687b67e785e8940a7dc60e7706a2dcfb24c37362ffe48f@ec2-54-163-254-204.compute-1.amazonaws.com:5432/df8hi9r1s7a3m0'

from app import views