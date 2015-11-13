'''
Python code that takes a JSON file (assumed to be coming from the diagrammer)
and checks whether all constraints / database rules are followed.
'''
import json


errors = []

with open("../data/dummy.json") as data_file:
	data = json.load(data_file)

def validate():
	# First, validate FK->PK constraint
	# This involves:
	# a) ensuring that the FK and PK exist in respective tables
	# b) the types of the two columns are the same
	relation_list = data["relations"]
	temp = [str(item) for item in relation_list]
	if len(temp) != len(set(temp)):
		errors.append("Duplicate relations exist!")
		
	entity_list = data["entities"]
	for relation in relation_list:
		fromTable = relation["from"]
		toTable = relation["to"]
		fromAttr = relation["FK"]
		toAttr = relation["PK"]
		fromNotFound = toNotFound = True
		fromType = toType = ""

		for entity in entity_list:
			if entity["name"] == fromTable:
				fromNotFound = False
				for attribute in entity["attributes"]:
					if attribute["name"] == fromAttr:
						fromType = attribute["datatype"]
						break
			elif entity["name"] == toTable:
				toNotFound = False
				for attribute in entity["attributes"]:
					if attribute["name"] == toAttr:
						toType = attribute["datatype"]
						break
		if fromNotFound == True:
			errors.append("Foreign key table ({0}) not found!".format(fromTable))
		if toNotFound == True:
			errors.append("Referenced PK table ({0}) not found!".format(toTable))
		if fromType != toType:
			errors.append("FK ({0}) and PK ({1}) types don't match!".format(fromTable+"."+fromAttr, toTable+"."+toAttr))

validate()
if len(errors):
	print "ERRORS:"
	for idx, error in enumerate(errors):
		print str(idx+1) + ".", error
