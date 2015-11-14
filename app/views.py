from flask import render_template, request
from app import app
from validate import *
from normalize import *
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
def post_1():
	return validate(request.stream.read())

@app.route('/api/normalize/', methods=['POST'])
def post_2():
	# print request.stream.read()
	print ret_normalize(request.stream.read())
	return "Success"