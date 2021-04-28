/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    
    
    data() {
    },
    methods: {
        
    }
});



app.component('app-header', {

    
    name: 'AppHeader',
    template: `
            <!DOCTYPE html>
            <html>
                <head>
                    
                    <title>
                    
                    </title>
                    <!--
                    {% block css %}
                    -->
                    
                    <link rel = 'stylesheet' href= '../static/css/base.css'/>
                    <link rel = 'stylesheet' href= '../static/css/bootstrap.css'/>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                    <!--
                    {% end block %}
                    -->
                </head>
                <body>
                    <!--
                    {% block main %}
                    
                    -->
                    
                    <div id = "navbar">
                        <header>
                            <i id = "car" class = "fa fa-car"></i>
                            <span id = "business-name" class = "navbar-text">United Auto Sales</span>
                            <span class = "nav-item logged-in"><a href = "/cars/new">Add Car</a></span>
                            <span class = "nav-item logged-in"><a href = "/explore">View Cars</a></span>
                            <span class = "nav-item logged-in"><a href = "/users/{user_id}">My Profile</a></span>
                            <span class = "account-ctrls logged-out" id = "/login"><a href = "/login">Login</a></span>
                            <span class = "account-ctrls logged-out" id = "/register"><a href = "/register">Register</a></span>
                            <span @click = "logout" class = "account-ctrls logged-in" id = "/logout"><a href = "/auth/logout">Logout</a></span>
                        </header>    
                    </div>
                    
    
    `,
    /*
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Project 2</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/cars/new">Add Car<span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/explore">View Cars<span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/users/{user_id}">My Profile<span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
      </div>
    </nav>
    */
    methods: { 


        logout(){
            fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                window.location.href = "/login/"
            })
        }
  
    }
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="fixed-bottom">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});


const LoginForm = {
    template: `
            <link rel = "stylesheet" href = "../static/css/login.css" type = "text/css"/>
            <main>
                <div id = "background">
                    <br>
                    <br>
                    
                    <h2 class = "form-title"><strong>Login to Your Account</strong></h2>
                    
                    <div id = "log-form-area">
                        <br>
                        <form id="loginForm" @submit.prevent="login" method = "POST" enctype="multipart/form-data">
                            
                            
                            <label class = "form-input-label ">Username</label>
                            <br>
                            <input type = "text" id = "username" name = "username" placeholder = "Username" class = "form-input"/>
                            <br>

                            <label class = "form-input-label ">Password</label>
                            <br>
                            <input type = "password" id = "password" name = "password" placeholder = "Password" class = "form-input"/>
                            <br>
                            <br>
                            <input class = "form-input save-btn" type = "submit" value = "Login"/>
                        </form>
                        
                    </div>
                    <br>
                    <br>
                    <br>
                </div>
            </main>
            <!--
            {% end block %}
            -->
        </body>
    </html>
    `,
    methods: {
        login() {
            let self = this;
            let loginForm = document.getElementById('loginForm');
            let form_data = new FormData(loginForm)

            fetch("/api/auth/login", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    let jwt_token = response.token;
                    let user_id = response.user_id;

                    // We store this token in localStorage so that subsequent API requests
                    // can use the token until it expires or is deleted.
                    localStorage.setItem("token", jwt_token);
                    localStorage.setItem("user_id", user_id);
                    console.info("Token generated and added to localStorage.");
                    self.token = jwt_token;
                    
                    console.log(response);
                    if(response['message'] == "Login Successful")
                    {
                        window.location.href = "/users/" + response['user_id']
                    }
                    else{
                        console.log("i forgot my password :(")
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
};


const RegisterForm = {
    template: `
            <link rel = "stylesheet" href = "../static/css/register.css" type = "text/css"/>
            <main>
                <div id = "background">
                    <br>
                    <br>
                    
                    <h1><strong>Register New User</strong></h1>
                    
                    <div id = "reg-form-area">
                        <br>
                        <form id="registerForm" @submit.prevent="register" method = "POST" enctype="multipart/form-data">
                            
                            
                            <label class = "form-input-label half">Username</label>
                            <label class = "form-input-label half">Password</label>
                            <br>
                            <input type = "text" id = "username" name = "username" placeholder = "Username" class = "form-input half"/>
                            <input type = "password" id = "password" name = "password" placeholder = "Password" class = "form-input half"/>
                            <br>
                            <br>

                            <label class = "form-input-label half">Fullname</label>
                            <label class = "form-input-label half">Email</label>
                            <br>
                            <input type = "text" id = "name" name = "name" placeholder = "Full Name" class = "form-input half"/>
                            <input type = "text" id = "email" name = "email" placeholder = "Email" class = "form-input half"/>
                            <br>
                            <br>

                            <label class = "form-input-label half">Location</label>
                            
                            <br>
                            <input type = "text" id = "location" name = "location" placeholder = "Location" class = "form-input half"/>
                            
                            <br>
                            <br>
                            
                            <br>
                            <label class = "form-input-label">Bio</label>
                            <br>
                            <textarea class = "form-input" name = "biography" id = "biography" placeholder="Biography..." rows="10" cols = "100"></textarea>
                            <br>
            
                            <label class = "form-input-label">Upload Photo</label>
                            <br>
                            <input type = "file" id = "photo" name = "photo" class = "form-input"/>
                            <br>
                            <br>
                            <input class = "form-input save-btn" type = "submit" value = "Register"/>
                        </form>
                        
                    </div>
                    <br>
                    <br>
                    <br>
                </div>
            </main>
            <!--
            
            -->
        </body>
    </html>
    `,
    methods: {
        register() {
            let self = this;
            let registerForm = document.getElementById('registerForm');
            let form_data = new FormData(registerForm)
            console.log(token);

            fetch("/api/register", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    //display a success message
                    self.errors = jsonResponse.errors;
                    console.log(jsonResponse);
                    if(jsonResponse['message'] == "User regristration Successful")
                    {
                        window.location.href = "/login"
                    }
                    else{
                        console.log("i forgot my password :(")
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
};



const CarForm = {
    template: `
    
    <!--<form method="post" enctype ="multipart/form-data" id = "carForm"  @submit.prevent="uploadCar">

    
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="make">Make</label>
                <input type="text" id="make" name="make">
            </div>
            <div class="form-group col-md-6">
                <label for="model">Model</label>
                <input type="text" id="model" name="model">
            </div>    
        </div>
        <br>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="colour">Colour</label>
                <input type="text" id="colour" name="colour">
            </div>
            <div class="form-group col-md-6">
                <label for="year">Year</label>
                <input type="text" id="year" name="year">
            </div>
        </div>
        <br>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label for="price">Price</label>
                <input type="text" id="price" name="price">
            </div>
            <div class="form-group col-md-6">
                <label for="car_type">Car Type</label>
                <select id="car_type" name="car_type">
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Truck">Truck</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Minivan">Minivan</option>
                    <option value="Pickup">Pickup</option>
                </select>
            </div>
        </div>
        <br>
        <div class="form-group">
            <label for="transmission">Transmission</label>
            <select id="transmission" name="transmission">
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
            </select>
        </div>
        <br>
        <div class="form-group">
            <label for="description">Description</label>
            <br>
            <textarea class="form-control" name="description"></textarea>
        </div>
        <br>
        <div class="form-group">
            <label for="photo">Upload Photo</label>
            <br>            
            <input type="file" name="photo" class="form-control">
        </div>
        <br>
        <button class="submit" type="submit">Submit</button type="submit" class="btn btn-primary" >
     </form> -->
            <link rel = "stylesheet" href = "../static/css/new_car.css" type = "text/css"/>
            <main>
                <div id = "background">
                    <br>
                    <br>
                    <!--{% for fieldName, errorMessages in form.errors.items(): %}
                        {% for err in errorMessages: %}
                            {{ err }}
                        {% endfor %}
                    {% endfor %}-->
                    <h1><strong>Add New Car</strong></h1>
                    
                    <div id = "car-form-area">
                        <br>
                        <form id="carForm" @submit.prevent="uploadCar" method = "POST" enctype="multipart/form-data">
                            <!-- {{ form.csrf_token  }} -->
                            
                            <label class = "form-input-label half">Make</label>
                            <label class = "form-input-label half">Model</label>
                            <br>
                            <input type = "text" id = "make" name = "make" placeholder = "Make" class = "form-input half"/>
                            <input type = "text" id = "model" name = "model" placeholder = "Model" class = "form-input half"/>
                            <br>
                            <br>

                            <label class = "form-input-label half">Colour</label>
                            <label class = "form-input-label half">Year</label>
                            <br>
                            <input type = "text" id = "colour" name = "colour" placeholder = "Colour" class = "form-input half"/>
                            <input type = "text" id = "year" name = "year" placeholder = "Year" class = "form-input half"/>
                            <br>
                            <br>

                            <label class = "form-input-label half">Price</label>
                            <label class = "form-input-label half">Type</label>
                            <br>
                            <input type = "text" id = "price" name = "price" placeholder = "Price" class = "form-input half"/>
                            <select name = "car_type" id = "car_type" class = "form-input half">
                                <option value="SUV">SUV</option>
                                <option value="Sedan">Sedan</option>
                                <option value="Truck">Truck</option>
                                <option value="Hatchback">Hatchback</option>
                                <option value="Minivan">Minivan</option>
                                <option value="Pickup">Pickup</option>
                            </select>
                            <br>
                            <br>
                            <br>
                            
                            <label class = "form-input-label half">Transmission</label>
                            <br>
                            <select name = "transmission" id = "transmission" class = "form-input half">
                                <option value = "Automatic">Automatic</option>
                                <option value = "Manual">Manual</option>
                            </select>
                            <br>
                            <br>
                            <label class = "form-input-label">Description</label>
                            <br>
                            <textarea class = "form-input" name = "description" id = "description" placeholder="Description..." rows="10" cols = "100"></textarea>
                            <br>
            
                            <label class = "form-input-label">Upload Photo</label>
                            <br>
                            <input type = "file" id = "photo" name = "photo" class = "form-input"/>
                            <br>
                            <br>
                            <input class = "form-input save-btn" type = "submit" value = "Add Car"/>
                        </form>
                        
                    </div>
                    <br>
                    <br>
                    <br>
                </div>
            </main>
            
            <!--
            {% end block %}
            -->
        </body>
    </html>
    `,
    methods: {
        uploadCar() {
            let self = this;
            let carForm = document.getElementById('carForm');
            let form_data = new FormData(carForm);

            fetch("/api/cars", {
                method: 'POST',
                body: form_data,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    //display a success message
                    console.log(jsonResponse);
                    self.errors = jsonResponse.errors;
                    window.location.href = "/users/" +jsonResponse['user_id'];
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
};


const ViewCar = {
    name: 'ViewCar',
    template: `<!--<div class="carDiv">
            <h2>This Car</h2>
            <div>
            <img v-bind:src=getImgUrl(car_data.photo)>
            <p> Year: {{ car_data.year }} </p> <p> Manufacturer: {{ car_data.make }} </p>
            <p> Model: {{ car_data.model }} </p>
            <p> Description: {{ car_data.description }} </p>
            <p> Price: {{ car_data.price }} </p>
            <p> Type: {{ car_data.car_type }} </p>
            <p> Colour: {{ car_data.colour }} </p>
 
            <button @click="addFavourite" >Add to Favourite</button>
            <button>Email Owner</button>
 
            </div>
            
        </div>-->
                <link rel = 'stylesheet' href= '../static/css/details.css'/>
                <div id = "car-card">
                    <div id="car-detail-image">
                        <img v-bind:src=getImgUrl(car_data.photo) class = "car-picture"/>
                    </div>
                    <div id = "car-detail">
                        <h2 id = "car-year">{{ car_data.year }} {{ car_data.make }}</h2>
                        <h3 id = "car-model">{{ car_data.model }}</h3>
                    
                    
                    
                        <p id = "description">
                            {{ car_data.description }}
                        </p>
                        <br>
                        <div id = "car-values">
                            <span class = "car-info">
                                <span class = "detail-title">Color</span>
                                <span class = "detail-value">{{car_data.colour}}</span>
                            </span>
                            <span class = "car-info">
                                <span class = "detail-title">Body Type</span>
                                <span class = "detail-value">{{car_data.car_type}}</span>
                            </span>
                            <span class = "car-info">
                                <span class = "detail-title">Price</span>
                                <span class = "detail-value">$ {{car_data.price}}</span>
                            </span>
                            <span class = "car-info">
                                <span class = "detail-title">Transmission</span>
                                <span class = "detail-value">{{car_data.transmission}}</span>
                            </span>
                        </div>
                        <br>
                        <span>
                            <button id = "email-owner">Email Owner</button>
                            <button id = "add-favourite" @click="addFavourite"><i id = "heart" class = "fa fa-heart-o" ></i></button>
                            
                        </span>
                    </div>
                    <br>
                    
                        
                        
                    
                </div>
                <!--
                {% end block %}
                -->
            </body>
        </html>`,
        created() {
            let self = this;
     
            let id = this.$route.query.uid
     
            fetch('/api/cars/' + String(id),
                {
                    method: 'GET',
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    }
                })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    self.car_data = data;
                })
        },
        data() {
            return {
                car_data: []
            }
        },
        methods: {
            addFavourite() {
                let self = this;
                let heart = document.getElementById("heart")
                let id = this.$route.query.uid
                if(heart.classList.contains("fa-heart-o"))
                {
                    heart.classList.remove("fa-heart-o");
                    heart.classList.add("fa-heart");
                    fetch('/api/cars/'+ (id) +'/favourite', {
                        method: 'POST',
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("token"),
                            'X-CSRFToken': token
                        }
                    })
                        .then(function (response) {
                            return response.json();
                        })
                        .then(function (data) {
                            console.log(data);
                            self.articles = data.articles;
                        })
                }
                else
                {
                    this.removeFavourite()
                }
                
                console.log(id)
                // console.log("hello")
                
                
            },

            removeFavourite() {
                let self = this;
                let id = this.$route.query.uid
                let heart = document.getElementById("heart")
                heart.classList.remove("fa-heart");
                heart.classList.add("fa-heart-o");
                console.log(id)
                // console.log("hello")
                
                fetch('/api/cars/'+ (id) +'/remove_favourite', {
                    method: 'POST',
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                        'X-CSRFToken': token
                    }
                })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log(data);
                        self.articles = data.articles;
                    })
            },
     
            getImgUrl(pic) {
                return '../static/car_uploads/'+ pic;
            }
        }
};
    




const ViewUser = {
    name: 'ViewUser',
    
    template: `<!--<div class="userDiv">
            <h2>User: {{ user_data.username }}</h2>
            <div>
            <img v-bind:src=getImgUrl(user_data.photo)>
            <p> Name: {{ user_data.name }} </p>
            <p> Bio: {{ user_data.biography }} </p>
            <p> Email: {{ user_data.email }} </p>
            <p> Location: {{ user_data.location }} </p>
            <p> Joined: {{ user_data.date_joined }} </p>
            </div>
            
        </div>-->
        
                <title>Profile: {{user_data.username}} </title>
                <link rel = 'stylesheet' href= '../static/css/profile.css'/>
                <div id = "information">
                    <div id = "profile-card">
                        <br>
                        <div class = 'profile-picture'>
                            <img v-bind:src=getImgUrl(user_data.photo) class = "user-picture"/>
                        </div>
                        <div class = "profile-info">
                            <span class = "user-name"><h2>{{ user_data.name }}</h2></span>
                            <span class = "user-tag"><h3>@{{ user_data.username }}</h3></span>

                            <span class = "user-details">
                                <span class = "detail-title">Bio</span>
                                <p class = "user-bio detail-value">
                                    {{ user_data.biography }}
                                </p>
                            </span>

                            

                            <br>
                            <div id = "user-info">
                                <span class = "user-details">
                                    <span class = "detail-title">Email</span>
                                    <span class = "detail-value">{{ user_data.email }}</span>
                                </span>
                                <br>
                                <br>
                                <span class = "user-details">
                                    <span class = "detail-title">Location</span>
                                    <span class = "detail-value">{{ user_data.location }}</span>
                                </span>
                                <br>
                                <br>
                                <span class = "user-details">
                                    <span class = "detail-title">Joined</span>
                                    <span class = "detail-value">{{ user_data.date_joined }}</span>
                                </span>
                            </div>
                            <br>
                            <br>
                            <br>
                        </div>
                        
                    </div>
                    <br>
                    <h2>Cars Favourited</h2>
                    <div id = "cars-list">
                        <!--
                            {$ for car in favourites %}
                                <div class = "car-card">
                                    <img src = "{{url_for('static',filename = 'images/{{car.media_addr}}')}}"/>
                                    <span class = "car-year-make">
                                        {{ car.year }}
                                        
                                        {{ car.make }}
                                    </span>
                                    <span class = "car-price">
                                        <i class = "fa fa-tag"></i> {{ car.price }}
                                    </span>
                                    <span class = "car-model">
                                        {{ car.model }}
                                    </span>
                                    <br>
                                    <br>
                                    <button class = "view-details" onclick="window.location.href='details/{{ car.id }}';"></button>
                                </div>
                            {% end for %}-->
                            
                            <div v-if=" num_fave>0">
                                <ul >
                                    <li v-for="car in favourites" class = "car-card">
                                        <img v-bind:src=getCarImgUrl(car.photo)>
                                        <span class = "car-year-make">
                                            {{ car.year }}
                                            
                                            {{ car.make }}
                                        </span>
                                        <span class = "car-price">
                                            <i class = "fa fa-tag"></i> {{ car.price }}
                                        </span>
                                        <span class = "car-model">
                                            {{ car.model }}
                                        </span>
                                        <br>
                                        <br>
                                        <button class = "view-details" @click=getCar(car.id) >View Details</button>
                                    </li>
                                </ul>
                            </div>
                            <div v-else>
                                <p>
                                    This user has not favourited any cars.
                                    
                                </p>
                            </div>
                    </div>
                </div> 
                        
                          
                <!--
                {% end block %}
                -->
            </body>
        </html>
        `,
        
        created() {
            let self = this;
           
            
            fetch('/api/users/' + self.user_id,
                {
                    method: 'GET',
                    headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    }
                })
                .then(function (response) {
                
                    return response.json();
                })
                .then(function (data) {
                    console.log(data)
                    
                    self.user_data = data;
                   
                })
                .catch(function (error) {
                    console.log(error);
                });
            
            fetch('/api/cars/' + self.user_id + '/favourites',
                {
                    method: 'GET',
                    headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    }
                })
                .then(function (response) {
                    
                    return response.json();
                })
                .then(function (data) {
                    console.log(data)
                    self.num_fave = data['num_fave']
                    self.favourites = data['favourites']
                    console.log(self.num_fave)
                    console.log(self.favourites)
                    
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        data() {
     
            return {
                user_data: [],
                favourites: [],
                user_id: localStorage.getItem("user_id"),
                num_fave:[],
                
            }
        },
        methods: {
            getImgUrl(pic) {
                return '../static/uploads/'+ pic;
            },
     
            getCarImgUrl(pic) {
                return '../static/car_uploads/'+ pic;
            },
     
            getCar(cid){
                this.$router.push({path:'/cars/' + cid, query: {uid:cid}})
            }
     
                
            
        }
    };
    


const ViewCars = {
    name: 'ViewCars',
    template: `
        <!--<div class="carsDiv">
                <div v-for="car in cars" >
                    
                    <img v-bind:src=getImgUrl(car.photo)>
                    <p> Year: {{ car.year }} </p> <p> Manufacturer: {{ car.make }} </p>
                    <p> Model: {{ car.model }} </p>
                    <p> Description: {{ car.description }} </p>
                    <p> Price: {{ car.price }} </p>
                    <p> Type: {{ car.car_type }} </p>
                    <p> Colour: {{ car.colour }} </p>
                    <button @click=getCar(car.id)>See Details</button>
                </div> 
        </div>-->
        <link rel = 'stylesheet' href= '../static/css/explore.css'/>
        <div id = "information">
            <h2>Explore</h2>
            <div id = "explore-card">
                <br>
                
                <div class = "profile-info">
                    <form id = "search-form" @submit.prevent = "searchCar" method = "POST" >
                        <label class = "form-input-label half">Make</label>
                        <label id = "model-label" class = "form-input-label half">Model</label>
                        <br>
                        <input type = "text" name = "make" id = "make" placeholder = "Make"  class = "explore form-input third"/>
                        <input type = "text" name = "model" id = "model" placeholder = "Model"  class = "explore  form-input third"/>
                        <button type = "submit" value = "Search"  class = "explore search-btn form-input third"><i class = "fa fa-search"></i>Search</button>
                    </form>
                </div>
                
            </div>
            <br>
            <div id = "cars-list">
            <ul>
                <li v-for="car in cars" class = "car-card">
                    <img v-bind:src=getCarImgUrl(car.photo)>
                    <span class = "car-year-make">
                        {{ car.year }}
                        
                        {{ car.make }}
                    </span>
                    <span class = "car-price">
                        <i class = "fa fa-tag"></i> {{ car.price }}
                    </span>
                    <span class = "car-model">
                        {{ car.model }}
                    </span>
                    <br>
                    <br>
                    <button class = "view-details" @click=getCar(car.id) >View Details</button>
                </li>
            </ul>
            </div>
        </div>   
        <!--
        {% end block %}
        -->
            </body>
        </html>
        `,
    created() {
        let self = this;
 
        fetch('/api/cars',
            {
                
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                }
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                self.cars = data.carlist;
                console.log(self.cars)
            })
            
    },
    data() {
        return {
            cars: []
        }
    },
    methods: {
        getImgUrl(pic) {
            return '../static/uploads/'+ pic;
        },

        getCarImgUrl(pic) {
            return '../static/car_uploads/'+ pic;
        },
 
        getCar(id){
            this.$router.push({path:'/cars/' + id, query: {uid:id}})
        },

        /*
            uploadCar() {
            let self = this;
            let carForm = document.getElementById('carForm');
            let form_data = new FormData(carForm);

            fetch("/api/cars", {
                method: 'POST',
                body: form_data,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (jsonResponse) {
                    //display a success message
                    console.log(jsonResponse);
                    self.errors = jsonResponse.errors;
                    window.location.href = "/users/" +jsonResponse['user_id'];
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        */
        searchCar(){
            let form = document.getElementById('search-form');
            let form_data = new FormData(form);
            
            
            console.log("HI");
            fetch("/api/search", {
                
                method: 'POST',
                body: form_data,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
                
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonResponse) {
                //display a success message
                console.log(jsonResponse);
                self.errors = jsonResponse.errors;
                window.location.href = "/search/" ;
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
};

const SearchResults = {
    name: 'SearchResults',
    template: `
        <!--<div class="carsDiv">
                <div v-for="car in cars" >
                    
                    <img v-bind:src=getImgUrl(car.photo)>
                    <p> Year: {{ car.year }} </p> <p> Manufacturer: {{ car.make }} </p>
                    <p> Model: {{ car.model }} </p>
                    <p> Description: {{ car.description }} </p>
                    <p> Price: {{ car.price }} </p>
                    <p> Type: {{ car.car_type }} </p>
                    <p> Colour: {{ car.colour }} </p>
                    <button @click=getCar(car.id)>See Details</button>
                </div> 
        </div>-->
        <link rel = 'stylesheet' href= '../static/css/explore.css'/>
        <div id = "information">
            <h2>SearchResults</h2>
            <div id = "explore-card">
                <br>
                
                <div class = "profile-info">
                    <form id = "search-form">
                        <label class = "form-input-label half">Make</label>
                        <label id = "model-label" class = "form-input-label half">Model</label>
                        <br>
                        <input type = "text" placeholder = "Make"  class = "explore form-input third"/>
                        <input type = "text" placeholder = "Model"  class = "explore  form-input third"/>
                        <button type = "submit" value = "Search" class = "explore search-btn form-input third"><i class = "fa fa-search"></i>Search</button>
                    </form>
                </div>
                
            </div>
            <br>
            <div id = "cars-list">
            <ul>
                <li v-for="car in results" class = "car-card">
                    <img v-bind:src=getCarImgUrl(car.photo)>
                    <span class = "car-year-make">
                        {{ car.year }}
                        
                        {{ car.make }}
                    </span>
                    <span class = "car-price">
                        <i class = "fa fa-tag"></i> {{ car.price }}
                    </span>
                    <span class = "car-model">
                        {{ car.model }}
                    </span>
                    <br>
                    <br>
                    <button class = "view-details" @click=getCar(car.id) >View Details</button>
                </li>
            </ul>
            </div>
        </div>   
        <!--
        {% end block %}
        -->
            </body>
        </html>
        `,
    created() {
        let self = this;
 
        fetch('/api/search',
            {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                    //'X-CSRFToken': token
                },
                //credentials: 'same-origin'
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                self.results = data.results;
                console.log(self.results)
            })
    },
    data() {
        return {
            results: []
        }
    },
    methods: {
        getImgUrl(pic) {
            return '../static/uploads/'+ pic;
        },

        getCarImgUrl(pic) {
            return '../static/car_uploads/'+ pic;
        },
 
        getCar(id){
            this.$router.push({path:'/cars/' + id, query: {uid:id}})
        }
    }
};


const Home = {
    name: 'Home',
    template: `
    <head>
        <!--{% include "base.html" %}-->
        <title>
        
        </title>
        <!--
        {% block css %}
        -->
        <link rel = 'stylesheet' href= '../static/css/index.css'/>        
        <!--
        {% end block %}
        -->
    </head>
    <body>
        <!--
        {% block main %}
        -->        
        <div id = "index">
            <div id = "landing-info">
                <h1>Buy and Sell Cars Online</h1>
                <p id ="website-bio">
                    United Auto Sales provides the fastest, easiest and most user friendly way to buy or
                    sell cars online. Find a great price on the vehicle <strong>you</strong> want.
                </p>
                <button class = "landing-btn" id = "landing-reg"><router-link to="/register">Sign Up</router-link></button>
                <button class = "landing-btn" id = "landing-log"><router-link to="/login">Login</router-link></button>
            </div>
            <div id = "landing-img">
                <img id = "index-img" style = "object-fit: cover;" src="../static/assets/home.jpg"/>
            </div>
            
        </div>
        <!--
        {% end block %}
        -->
    </body>
    

    `,
    data() {
        return {}
    },
    methods: {
        removeToken() {
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            console.info("Token removed from localStorage.");
            alert("Token removed!");
        }
    }
};

const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    // Put other routes here
    { path: "/register", component: RegisterForm },
    { path: "/login", component: LoginForm },
    { path: "/cars/new", component: CarForm },
    { path: "/explore", component: ViewCars },
    { path: "/users/:user_id", component: ViewUser},
    { path: "/cars/:car_id", component: ViewCar},
    { path: "/search/", component: SearchResults},
    { path: "/cars/:user_id/favourites", component: ViewUser},
    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
});

app.use(router);

app.mount('#app');