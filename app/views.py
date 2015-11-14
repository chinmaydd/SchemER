from flask import render_template, request
from app import app
from validate import *
from normalize import *
import pdb

@app.route('/')
@app.route('/index')
def index():
    return render_template('ER.html')

@app.route('/api/sql/', methods=['POST'])
def post_1():
	return validate(request.stream.read(), 0)

@app.route('/api/normalize/', methods=['POST'])
def post_2():
	return validate(request.stream.read(), 1)

@app.route('/api/normalize/diagram', methods=['POST'])
def post_3():
	return validate(request.stream.read(), 2)