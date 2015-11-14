'''
Python code that takes valid SQL and interfaces with MySQL to execute it.
'''
import MySQLdb
import sys


db = MySQLdb.connect(host="localhost", # your host, usually localhost
                     user="root", # your username
                     passwd="password") # your password

# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

try:
    fname = sys.argv[1]
except:
    print "Usage: python databaseHandler.py <pathToSQLFile>"
    sys.exit(0)

f = open(fname, 'r')
sql = f.read()
f.close()

cur.execute("DROP DATABASE IF EXISTS dummy;CREATE DATABASE dummy;USE dummy;")
# Use all the SQL you like
cur.execute(sql)
