'''
Python code that takes a JSON file (assumed to be coming from the diagrammer) 
and normalizes it based on the entered functional dependencies (upto 2NF).
'''
import json, ast, copy, pdb
# errors = []
final_list = []
relation_list = []

# with open("../data/dummy.json") as data_file:
# 	data = json.load(data_file)

def subset( list1 , list2 ):
	for l in list1:
		if l not in list2:
			return False
	return True

def com_el( list1 ,  list2):
	for l in list1:
		if l in list2:
			return True
	return False

def normalize( entity ):
	FK = [ ]
	PK = [ ]
	FD = entity["fds"]
	for relation in relation_list:
		if( relation["from"] == entity["name"] ):
			FK = list( set( FK + relation["FK"].split(',') ) )
	for attr in entity["attributes"]:
		if attr["isPK"] == "True":
			PK.append( attr["name"] )
	FK = FK
	PK = PK
	FDvisited = []
	for  i in range(len(FD)):
		lhs , rhs = FD[ i ].split('~')
		lhs = lhs.split(',')
		rhs = rhs.split(',')
		attr = [ ]
		fd = [ ]
		fduse = [ ]
		if( lhs != PK and not com_el(lhs,FK)  and  i not in FDvisited):
			attr = attr + lhs
			fduse.append( i )
			rnew = [ ]
			for r in rhs:
				if(r not in FK):
					attr.append(r)
					rnew.append(r)
			fd.append( '~'.join([ ','.join(lhs) , ','.join(rnew) ]) )
			for j in range( len(FD) ):
				if(i != j and j not in FDvisited):
					lhsi,rhsi = FD[j].split('~')
					lhsi = sort( lhsi.split(',') )
					rhsi = sort( rhsi.split(',') )
					if( com_el(rhsi,lhs) ):
						attr = [ ]
						fd = [ ]
						fduse = [ ]
						break
					if( subset(lhsi,attr) ):
						fduse.append(j)
						rnew = [ ]
						for r in rhsi:
							if( r not in FK and r not in attr):
								attr.append( r )
								rnew.append( r )
						fd.append( '~'.join([ ','.join(lhsi) , ','.join(rnew) ]) )
			if( len(attr) -len(lhs) > 0 ):
				FDvisited =list(set(FDvisited + fduse))
				attr_list_1 = [ copy.deepcopy(d) for d in entity["attributes"] if d["name"] in attr ]
				for d in attr_list_1:
					d["isPK"] = "False"
				attr_list_2 = [ d for d in entity["attributes"] if d["name"] not in attr or d["name"] in lhs or d["name"] in PK ]
				new_name = entity["name"]+'_'+str(i)
				FD_new = fd
				entity["attributes"] = attr_list_2
				newentity = dict()
				newentity["name"] = new_name
				newentity["attributes"] = attr_list_1
				for k in range(len(newentity["attributes"])):
					if(newentity["attributes"][i]["name"] in lhs):
						newentity["attributes"][i]["isPK"] = "True"
				newentity["fds"] = FD_new
				relation = dict()
				relation["from"] = entity["name"]
				relation["to"] = new_name
				relation["FK"] = ','.join(lhs)
				relation["PK"] = ','.join(lhs)
				relation_list.append(relation)
				normalize(newentity)
	entity["fds"] = [ FD[i] for i in range(len(FD)) if i not in FDvisited]
	final_list.append(entity)

def ret_normalize(data):
	global final_list, relation_list
	relation_list = data["relations"]
	entity_list   = data["entities"]
	
	for entity in entity_list:
		normalize(entity)

	final_dict = { "entities" : final_list , "relations" : relation_list}
	return str(final_dict)
	# with open('../data/dummynormal.json', 'w') as fp:
	#     json.dump(final_dict, fp)