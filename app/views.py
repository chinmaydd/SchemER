from flask import render_template, request
from app import app


@app.route('/')
@app.route('/index')
def index():
    return "Hello, world!"


@app.route('/er')
def er():
    return render_template('ER.html')


@app.route('/success', methods=['POST'])
def success():
	f = open('static/text/erdata.txt', 'w')
	f.write(request.form['test'])
    return 'Success!' + request.form['test']
