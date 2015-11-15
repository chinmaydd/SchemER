'''
Python code that takes a valid JSON file and produces the corresponding SQL
DDL for table generation.
'''
import json
import sys, pdb
from pprint import pprint

# try:
# 	f = sys.argv[1]
# except:
# 	print "Usage: python generator.py <pathToJSON>"
# 	sys.exit(1)

# with open(f) as data_file:
#     data = json.load(data_file)

def generate(data):
	# print data
	# Process entities first
	entity_list = data["entities"]
	relation_list = data["relations"]
	ddl = []

	#Table Creation
	for entity in entity_list:
	    chunks = []
	    pkeys = []
	    chunks.append("CREATE TABLE " + entity["name"] + "\n(\n")
	    for attribute in entity["attributes"]:
	        chunks.append(attribute["name"] + " " + attribute["datatype"])
	        chunks.append(",\n")
	        if attribute["isPK"] == "True":
	        	pkeys.append(attribute["name"])
	    if len(pkeys) > 0:
	    	chunks.append("PRIMARY KEY (" + ', '.join(pkeys) + ")")
	    else:
	    	chunks.pop()
	    
	    chunks.append("\n);\n")
	    ddl.append(''.join(chunks))

	#Adding constraints to tables
	for entity in entity_list:
		chunks = []
		mflag = False
		chunks.append("ALTER TABLE " + entity["name"] + "\n")
		for attribute in entity["attributes"]:
			flag = False
			blocks = []
			blocks.append("MODIFY " + attribute["name"] + " " + attribute["datatype"])
			if(attribute["notNULL"] == "True"):
				blocks.append("NOT NULL")
				flag = True
			if(attribute["isUnique"] == "True"):
				blocks.append("UNIQUE")
				flag = True

			if(flag):
				chunks.append(' '.join(blocks))
				chunks.append(',')
				mflag = True
		# remove last comma
		chunks.pop()
		chunks.append(";\n")
		if(mflag):
			ddl.append(' '.join(chunks))

	for relation in relation_list:
		chunks = []
		table1 = relation["to"]
		table2 = relation["from"]
		FK = relation["FK"]
		PK = relation["PK"]
		FK_list = FK.split(',')
		PK_list = PK.split(',')
		FK_list = [ s for s in FK_list if s != '' ]
		PK_list = [ s for s in PK_list if s != '' ]
		FK = ','.join(FK_list)
		PK = ','.join(PK_list)
		# add foreign key constraint
		chunks.append("ALTER TABLE "+ table1 + "\n")
		chunks.append("ADD FOREIGN KEY ("+FK+")\n")
		chunks.append("REFERENCES "+table2+"("+PK+");")
		ddl.append(''.join(chunks))

	# Writing to file
	fd = open('app/data/SQL.in', 'w')

	for d in ddl:
	    fd.write(d)

	fd.close()
	# return str(ddl)
	return '<br>'.join(ddl)