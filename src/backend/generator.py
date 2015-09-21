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


pprint(data)
for d in ddl:
    print d
