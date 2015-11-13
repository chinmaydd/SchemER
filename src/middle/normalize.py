'''
Python code that takes a JSON file (assumed to be coming from the diagrammer)
and normalizes it based on the entered functional dependencies (upto 2NF).
'''
import json


errors = []

with open("../data/dummy.json") as data_file:
	data = json.load(data_file)

def normalize():
	entity_list = data["entities"]
	entity_pks = {}
	for entity in entity_list:
		entity_pks[entity["name"]] = []
		for attr in entity["attributes"]:
			if attr["isPK"] == "True":
				entity_pks[entity["name"]].append(attr["name"])
	print entity_pks

normalize()	