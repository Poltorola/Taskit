import os                           # to get secret key from environment variable
import hashlib                      # to encode passwords with hash-functions
from dotenv import load_dotenv      # to parse and load environment variable

from flask import (
    Flask, 
    render_template,    # to process html template with jinja syntax to html-file for browser
    jsonify,            # turns python objects into text in json format
    make_response,      # to return code 200 if there's no changes to display for user
    redirect,           # redirects user to another page
    flash,              # to display flash messages about user's actions (login, etc)
    request,            # an object which embodies user's requests
    session             # an object to store user's state (on client-side via cookies)
)

from forms import LoginForm     # to create an object from user's inputs into html-form
from mongo_taskit_api import (  # methods to work with NoSQL database (mongo)
    check_user, 
    get_user_tasks, 
    save_user, 
    save_user_tasks
)

load_dotenv()
FILE_NAME = 'my_file.json'  # to store cards data

app = Flask("taskit")                                                       #http://127.0.0.1:5000
app.config['SECRET_KEY'] = os.getenv("FLASK_SECRET_KEY")    # TODO add a secret code generation


# ------------------------- Login Page -------------------------------- #

# test@example.com 3r4wefhf3iu4herknjn


@app.route('/login', methods=['GET', 'POST'])
def login():                                                            # login 
    if 'user' in session:  # Check if user is already logged in
        return redirect('/taskit')
    
    form = LoginForm()        
    if form.validate_on_submit():                
        email = form.email.data
        password = form.password.data
        if check_user(email, hashlib.sha256(password.encode()).hexdigest()):    # hash for passwords
            session['user'] = email
            flash('Login successful!', 'success')
            return redirect('/taskit') 
        else:
            flash('Invalid email or password', 'danger')
            return redirect('/login')

    return render_template('login.html', form=form)


@app.route('/logout')       # Log Out : returns user to main page with less functionality
def logout():
    session.pop('user', None)
    flash('You have been logged out.', 'info')    
    return redirect('/taskit')


# ------------------------- Home Page -------------------------------- #

@app.route('/taskit')   
def taskit():
    return render_template('taskit.html')

@app.route('/cards', methods=['GET', 'POST'])   # returns user's cards
def cards():
    if 'user' not in session:
        if request.method == 'GET':
            return jsonify([])
        return make_response('', 200)

    email = session.get("user")

    if request.method == 'GET':
        tasks = get_user_tasks(email)
        return jsonify(tasks)

    save_user_tasks(email, request.get_json())
    return make_response('', 200)


if __name__ == "__main__":
    app.run(debug=True) # , host='0.0.0.0', port=80
