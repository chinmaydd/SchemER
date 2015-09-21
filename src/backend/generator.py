'''
Python code that takes a valid JSON file and produces the corresponding SQL
DDL for table generation.
'''
import json
from pprint import pprint

with open('dummy.json') as data_file:
    data = json.load(data_file)

# Process entities first
entity_list = data["entities"]
ddl = []

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
		if(attribute["CHECK"] != ""):
			blocks.append("CHECK(" + attribute["CHECK"] + ")");
			flag = True
		if(attribute["DEFAULT"] != ""):
			blocks.append("DEFAULT " + attribute["DEFAULT"]);
			flag = True
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

for d in ddl:
    print d
			