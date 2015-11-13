'''
Python code that takes a valid JSON file and produces the corresponding SQL
DDL for table generation.
'''
import json
from pprint import pprint

with open('../data/dummy.json') as data_file:
    data = json.load(data_file)

# Process entities first
entity_list = data["entities"]
relation_list = data["relations"]
ddl = []

#Table Creation
for entity in entity_list:
    chunks = []
    chunks.append("CREATE TABLE " + entity["name"] + "\n(\n")
    for attribute in entity["attributes"]:
        chunks.append(attribute["name"] + " " + attribute["datatype"])
        chunks.append(",\n")
    # remove last comma
    chunks.pop()
    chunks.append("\n)")
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
		if(attribute["isPK"] == "True"):
			blocks.append("PRIMARY KEY")
			flag = True
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
	chunks.append(";")
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


for d in ddl:
    print d
			
