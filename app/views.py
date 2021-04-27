"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os
from app import app, db, login_manager
from json import JSONEncoder
from flask import render_template, request, redirect, url_for, flash, jsonify, g
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import LoginForm, RegisterUserForm, AddCarForm, SearchForm
from app.models import User, Car, Favourite
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime

# Using JWT
import jwt, base64
from flask import _request_ctx_stack
from functools import wraps

class MyEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__  

#JWT Token checking
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', None)
        if not auth:
            return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401
        sections = auth.split()
        if sections[0].lower() != 'bearer':
            return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with bearer'}), 401 
        elif len(sections) == 1:
            return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
        elif len(sections) > 2:
            return jsonify({'code': 'invalid_header', 'description': 'Authorization header must bearer + \s + token'}), 401
         
        token = sections[1]
        try:
            ids = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            return jsonify({'code': 'expired_token', 'description': 'Your token is expired'}), 401
        except jwt.DecodeError:
            return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

        g.current_user = user = ids
        return f(*args, **kwargs)
    return decorated

###
# Routing for your application.
###

# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def home(path):
    """Render website's home page."""
    return render_template('index.html')

#NEED TO FIX JWT TOKEN
@app.route("/api/auth/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit():        
        if form.username.data:
            # Get the username and password values from the form.
            username = form.username.data
            password = form.password.data
            # using your model, query database for a user based on the username
            # and password submitted. Remember you need to compare the password hash.
            # You will need to import the appropriate function to do so.
            # Then store the result of that query to a `user` variable so it can be
            # passed to the login_user() method below.
            user = User.query.filter_by(username=username).first()
            # get user id, load into session
            if user is not None and check_password_hash(user.password, password):
                print(user)
                login_user(user)
                ids = {'user': user.username}
                token = jwt.encode(ids, app.config['SECRET_KEY'], algorithm = 'HS256')

                data = {
                    "message": "Login Successful",
                    "token": token,
                    "user_id": user.id,
                    "success": 1
                }             
                flash ("Login successful!", "success")
                return jsonify(data)
            error = "Incorrect username or password."
            return jsonify(error=error)
    all_errors = form_errors(form)
    return jsonify(errors=all_errors)
    

@app.route("/api/auth/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    if request.method == "POST":
        message = {
            "message": "Log out successful"
        }
        flash("You have been logged out.", "danger")
        return redirect("/login")
    


@app.route("/api/register", methods=["POST"])
def register():
    form = RegisterUserForm()

    if request.method == "POST": # and form.validate_on_submit()
        username = form.username.data
        user = User.query.filter_by(username=username).first()
        if user is None: 
            password = form.password.data
            name = form.name.data
            email = form.email.data
            location = form.location.data
            biography = form.biography.data
            photo = form.photo.data
            print("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
            print(photo)
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            date_joined = datetime.now()
            #NOT SURE IF DATE JOINED MUST BE IN CONSTRUCTOR HERE OR SET IN DB
            newUser = User(username, password, name, email, location, biography, filename, date_joined)

            db.session.add(newUser)
            db.session.commit()
            flash ("User added successfully", "success")
            flash("Please login with your credentials below")
            data = {
                "id": newUser.id,
                "username": username,
                "password": password,
                "name": name,
                "email": email,
                "location": location,
                "biography": biography,
                "photo": filename,
                "date_joined": date_joined
            }
            return jsonify({"message":"User regristration Successful", "username": username, "date_joined" : date_joined, "success":1}) 
        else:
            flash ("Someone is already using this username", "danger")
            return jsonify({"message":"User already registered", "success":0}) 
    else:
        errors = form_errors(form)
        return jsonify(errors=form_errors(errors))

# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

###
# The functions below should be applicable to all Flask apps.
###


@app.route("/api/cars", methods=["GET", "POST"])
@requires_auth
def getCars():
    form = AddCarForm()
    if request.method == "GET":
        carlist = []
        allCars = db.session.query(Car).all()

        for car in allCars:
            c = {
                "id": car.id,
                "description": car.description,
                "year": car.year,
                "make": car.make,
                "model": car.model,
                "colour": car.colour,
                "transmission": car.transmission,
                "car_type": car.car_type,
                "price": car.price,
                "photo": car.photo,
                "user_id": car.user_id
            }
            carlist.append(c)
        return jsonify(carlist = carlist), 200
    if request.method == "POST" and form.validate_on_submit():
        make = form.make.data
        model = form.model.data
        colour = form.colour.data
        year = form.year.data
        price = form.price.data
        car_type = form.car_type.data
        transmission = form.transmission.data
        description = form.description.data
        photo = form.photo.data
        
        username = g.current_user['user']
        
        user = User.query.filter_by(username=username).first()
        user_id = user.id
        
        
        filename = secure_filename(photo.filename)
        hello = os.path.join(app.config['CAR_UPLOAD_FOLDER'], filename)
        print("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        print(hello)
        photo.save(os.path.join(app.config['CAR_UPLOAD_FOLDER'], filename)) 
        newCar = Car(description, make, model, colour, year, transmission, car_type, price, filename, user_id)
        #ADD TO DB
        db.session.add(newCar)
        db.session.commit()
        flash ("Car added successfully", "success")
        data = {
            "id": newCar.id,
            "description": newCar.description,
            "year": newCar.year,
            "make": newCar.make,
            "model": newCar.model,
            "colour": newCar.colour,
            "transmission": newCar.transmission,
            "car_type": newCar.car_type,
            "price": newCar.price,
            "photo": newCar.photo,
            "user_id": newCar.user_id
        }
        return jsonify(data), 201
    else:
        errors = form_errors(form)
        return jsonify(errors)

@app.route("/api/cars/<car_id>", methods=["GET"])
@requires_auth
def getCar(car_id):

    c = Car.query.filter_by(id=car_id).first()
    response = {
        "id": c.id,
        "description": c.description,
        "year": c.year,
        "make": c.make,
        "model": c.model,
        "colour": c.colour,
        "transmission": c.transmission,
        "car_type": c.car_type,
        "price": c.price,
        "photo": c.photo,
        "user_id": c.user_id
    }
    return jsonify(response), 200

@app.route("/api/cars/<car_id>/favourite", methods=["POST"])
@requires_auth
def favourite(car_id):
    if(car_id == 'undefined'):
        car_id = request.args.get('id')
    if request.method == "POST":
        user = User.query.filter_by(username=g.current_user["user"]).first()
        user_id = user.id
        # user_id = g.current_user["user"] #IDK HOW TO GET THIS FROM THE AUTH
        
        newFav = Favourite(car_id, user_id)
        
        try:
            db.session.add(newFav)
            db.session.commit()
            
            response = {
                "message": "Car Successfully Favourited",
                "car_id": car_id
            }
            return jsonify(response), 200
        except Exception as e:
            print(e)
            response = {
                "message": "Access token is missing or invalid",                
            }
            return jsonify(response), 401

     
@app.route("/api/cars/<car_id>/remove_favourite", methods=["POST"])
@requires_auth
def remove_favourite(car_id):
    if(car_id == 'undefined'):
        car_id = request.args.get('id')
    if request.method == "POST":
        user = User.query.filter_by(username=g.current_user["user"]).first()
        user_id = user.id
        # user_id = g.current_user["user"] #IDK HOW TO GET THIS FROM THE AUTH
        
        
        
        try:
            Favourite.query.filter_by(
                car_id = car_id,
                user_id = user_id
            ).delete()
            db.session.commit()
            
            response = {
                "message": "Car Successfully unavourited",
                "car_id": car_id
            }
            return jsonify(response), 200
        except Exception as e:
            print(e)
            response = {
                "message": "Access token is missing or invalid",                
            }
            return jsonify(response), 401


@app.route("/api/search", methods=["POST"])
@requires_auth
def search():
    form = SearchForm()
    results=[]
    if request.method=="POST":
        make = form.make.data
        model = form.model.data
        
        search_cars= Car.query.filter_by(make= make).filter_by(model = model).all()
        print("HIIIIIIIIIIIIIIIIIIIIIIIIIII")
        print(search_cars)
        for c in search_cars:
            car={}
            car['id']=c.id
            car["user_id"]=c.user_id
            car["year"]=c.year            
            car["price"]=c.price
            car["photo"]=c.photo
            car["make"]=c.make
            car["model"]=c.model
            results.append(car)
        return jsonify(results)
    else:
        print(form.errors)

@app.route("/api/users/<user_id>", methods=["GET"])
@requires_auth
def getUser(user_id):
    try:
        print("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOoo")
        print(user_id)
        user = User.query.filter_by(id=user_id).first()
        print(user.username)
        response = {
            "id": user.id,
            "username": user.username,
            "password": user.password,
            "name": user.name,
            "email": user.email,
            "location": user.location,
            "biography": user.biography,
            "photo": user.photo,
            "date_joined": user.date_joined
        }
        return jsonify(response), 200
    except:
        response = {
            "message": "Access token is missing or invalid"
        }
        return jsonify(response), 401


def make_car_dict(fave: int):
    print("hey")
    car = Car.query.filter_by(id=fave).first()
    buff = {}
    
    buff['make'] = car.__dict__['make']
    buff['model'] = car.__dict__['model']
    buff['photo'] = car.__dict__['photo']
    buff['year'] = car.__dict__['year']
    buff['id'] = car.__dict__['id']
    buff['price'] = car.__dict__['price']
   
    return buff

@app.route("/api/cars/<user_id>/favourites", methods=["GET"])
@requires_auth
def userFavourites(user_id):        
    if request.method == "GET":
        '''try:
            favourites = Favourite.query.filter_by(id=user_id).first()
            fave_car = Car.query.filter_by(id=favourites.car_id).first()
        except:
            favourites = []
            fave_car = '''
        try:
            try:
                print("test 1")
                try:
                    fave_list = Favourite.query.filter_by(user_id=user_id).all()
                except Exception as e:
                    print(e)
            except Exception as e:
                fave_list = ''
            #print("HELLLLLLLLLLLLLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
            #print(fave_list)
            
            print("HEllo")
            print(fave_list)       
            response = {
                "message": "List of Favourites",
                "num_fave": len(fave_list),
                "favourites": [make_car_dict(fav.car_id) for fav in fave_list]
                #"car_id": car_id
            }
            print(response)
            '''if fave_list is not []:
                car_list = []
                for fave in fave_list:
                    car = Car.query.filter_by(fave.car_id).first()
                    car_list.append(car.photo)
                response['car_list'] = car_list
            return jsonify(response), 200'''
            return jsonify(response), 200
        except Exception as e:
            print (e)
            response = {
                "message": "Access token is missing or invalid",                
            }
            return jsonify(response), 401

@app.route('/token')
def generate_token():
    # Under normal circumstances you would generate this token when a user
    # logs into your web application and you send it back to the frontend
    # where it can be stored in localStorage for any subsequent API requests.
    payload = {
        'sub': '12345', 
        'name': 'John Doe',
        'iat': datetime.datetime.now(datetime.timezone.utc),
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=30)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify(error=None, data={'token': token}, message="Token Generated")

    # If you wanted to store the token in a cookie
    # resp = make_response(jsonify(error=None, data={'token': token}, message="Token Generated"))
    # resp.set_cookie('token', "Bearer " + token, httponly=True, secure=True)
    # return resp




def form_errors(form):
    error_messages = []
    """Collects form errors"""
    
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (getattr(form, field).label.text, error)
            error_messages.append(message)
    return error_messages
    
    




@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")