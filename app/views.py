from flask import render_template, request
from app import app
from validate import *
import pdb

@app.route('/')
@app.route('/index')
def index():
    return render_template('ER.html')

# @app.route('/success', methods=['POST'])
# def success():
# 	f = open('static/text/erdata.txt', 'w')
# 	f.write(request.form['test'])
# 	return 'Success!' + request.form['test']

@app.route('/api/sql/', methods=['POST'])
def post():
	return validate(request.stream.read())