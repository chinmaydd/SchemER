'''
Python code that takes a valid JSON file and produces the corresponding SQL
DDL for table generation.
'''
import json
import sys
from pprint import pprint

try:
	f = sys.argv[1]
except:
	print "Usage: python generator.py <pathToJSON>"
	sys.exit(1)

with open(f) as data_file:
    data = json.load(data_file)

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
    chunks.append("PRIMARY KEY (" + ', '.join(pkeys) + ")")
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
		if(attribute["isUNIQUE"] == "True"):
			blocks.append("UNIQUE")
			flag = True
		# if(attribute["isPK"] == "True"):
		# 	blocks.append("PRIMARY KEY")
		# 	flag = True
		# if(attribute["CHECK"] != ""):
		# 	blocks.append("CHECK(" + attribute["CHECK"] + ")")
		# 	flag = True
		# if(attribute["DEFAULT"] != ""):
		# 	blocks.append("DEFAULT " + attribute["DEFAULT"])
		# 	flag = True
		if(flag):
			chunks.append(' '.join(blocks))
			mflag = True
		else:
			chunks.pop()
		chunks.append(",\n")
	# remove last comma
	chunks.pop()
	chunks.append(";\n")
	if(mflag):
		ddl.append(' '.join(chunks))

for relation in relation_list:
	chunks = []
	table1 = relation["from"]
	table2 = relation["to"]
	FK = relation["FK"]
	PK = relation["PK"]
	# add foreign key constraint
	chunks.append("ALTER TABLE "+ table1 + "\n")
	chunks.append("ADD FOREIGN KEY ("+FK+")\n")
	chunks.append("REFERENCES "+table2+"("+PK+");")
	ddl.append(''.join(chunks))
# create table for relation attributes
	# if len(relation["attributes"])>0:
    		# chunks = []
     		# chunks.append("CREATE TABLE " + relation["name"] + "\n(\n")
    		# for attribute in relation["attributes"]:
        			# chunks.append(attribute["name"] + " " + attribute["datatype"])
        			# chunks.append(",\n")
 # remove last comma
    		# chunks.pop()
    		# chunks.append("\n)")
   		# ddl.append(''.join(chunks))
   		# chunks = []
		# mflag = False
		# chunks.append("ALTER TABLE " + entity["name"] + "\n")
#add constraints to table
		# for attribute in relation["attributes"]:
		# 	flag = False
		# 	blocks = []
		# 	blocks.append("MODIFY " + attribute["name"] + " " + attribute["datatype"])
		# 	if(attribute["notNULL"] == "True"):
		# 		blocks.append("NOT NULL")
		# 		flag = True
		# 	if(attribute["isUNIQUE"] == "True"):
		# 		blocks.append("UNIQUE")
		# 		flag = True
		# 	if(attribute["isPK"] == "True"):
		# 		blocks.append("PRIMARY KEY")
		# 		flag = True
		# 	if(attribute["CHECK"] != ""):
		# 		blocks.append("CHECK(" + attribute["CHECK"] + ")");
		# 		flag = True
		# 	if(attribute["DEFAULT"] != ""):
		# 		blocks.append("DEFAULT " + attribute["DEFAULT"]);
		# 		flag = True
		# 	if(flag):
		# 		chunks.append(' '.join(blocks))
		# 		mflag = True
		# 	else:
		# 		chunks.pop()
		# 	chunks.append(",\n")
# remove last comma
		# chunks.pop()
		# chunks.append(";")
		# if(mflag):
		# 	ddl.append(' '.join(chunks))

fd = open('../data/SQL.in', 'w')

for d in ddl:
    fd.write(d)

fd.close()
