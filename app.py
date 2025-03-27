from flask import Flask, render_template, request, jsonify, make_response  #http://127.0.0.1:5000
import json
import os.path

FILE_NAME = 'my_file.json'

app = Flask("taskit")       

# 6) после добавления логина, здесь нужно будет внести изменения
# чтобы функция отдавала json, связанный с конкретным авторизованным пользователем
# а если пользоваетль не авторизован, то редиректила его на страницу 
# /login
# и при сохранении json тоже нужно проверять, что пользователь авторизован
@app.route('/taskit')
def home():
    return render_template('taskit.html')

# 6) после добавления логина, здесь нужно будет внести изменения
# чтобы функция отдавала json, связанный с конкретным авторизованным пользователем
# а если пользоваетль не авторизован, то редиректила его на страницу 
# /login
# и при сохранении json тоже нужно проверять, что пользователь авторизован


@app.route('/cards', methods=['GET', 'POST'])
def cards():
    if request.method == 'GET':
        # 3) чтение json и отправка
        # todo replace file to database
        if os.path.isfile(FILE_NAME):
            with open(FILE_NAME, 'r') as f:
                j = json.load(f)
        else:
            j = []
        return jsonify(j)
    if request.method == 'POST':
        j = request.get_json()
        # 2) запись json
        # todo replace file to database
        with open(FILE_NAME, 'w') as f:
            json.dump(j, f)
        print(j)
        return make_response('', 200)
    
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        # 4) отдать форму ввода логина и пароля
        return render_template('login.html')
    if request.method == 'POST':
        # 5) проверить логин и пароль
        return make_response('', 200)

# def button_click():
#     data = request.json
#     print("Clicked!")
#     return jsonify({"message": "Button click received!"})

if __name__ == "__main__":
    app.run(debug=True)