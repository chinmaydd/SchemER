/**
  * Declaring global variables and arrays
  */
var nodeDataArray = [];
var linkDataArray = [];
var tableArray = [];
var flag = 0;
var entities = {};
var count_attr = 0;
var current_table;
var Aselect_value = 0;
var Bselect_value = 0;
var global_table_sel;
var global_option_sel;
var for_length = 0;
var save_data;
var save_link;
var s;
var copy_json;
var myDiagram, yellowgrad, bluegrad, greengrad, redgrad, lightgrad;
declareColors();

/**
 * Add different diagrams to different attributes
 */

/* Define several shared brushes */
function declareColors()
{
  yellowgrad = go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
  bluegrad   = go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
  greengrad  = go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
  redgrad    = go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
  lightgrad  = go.GraphObject.make(go.Brush, "Linear", { 1: "#E6E6FA", 0: "#FFFAF0" });
}

/////////////////////////////
/////// FD functions ////////
/////////////////////////////

function addAfunc() {
  funca = document.getElementById('funcA');
  var temp = global_option_sel.cloneNode(true);
  temp.id = "Afunc_dep" + Aselect_value;
  Aselect_value+=1

  funca.appendChild(temp);
}

function addBfunc() {
  funcb = document.getElementById('funcB');
  var temp = global_option_sel.cloneNode(true);
  temp.id = "Bfunc_dep" + Bselect_value;
  Bselect_value+=1

  funcb.appendChild(temp);
}

function populateFD() {
  Aselect_value = 0;
  Bselect_value = 0;
  funca = document.getElementById('funcA');
  funcb = document.getElementById('funcB');
  var func = document.getElementById('func_dep_table');
  var val = func.options[func.selectedIndex].text;

  current_table = val;

  indexes = $.map(nodeDataArray, function(obj, index) {
      if(obj.key == current_table) {
          return index;
      }
  });

  var idx = indexes[0];
  var opt;
  var sel1 = document.createElement('select');

  for(var i=0;i<nodeDataArray[idx].items.length;i++) {
    opt = document.createElement('option');
    opt.value = nodeDataArray[idx].items[i].name;
    opt.selected = '';
    opt.innerHTML = nodeDataArray[idx].items[i].name;
    sel1.appendChild(opt);    
  }

  var sel2 = sel1.cloneNode(true);
  global_option_sel = sel2.cloneNode(true);

  sel1.id = "Afunc_dep" + Aselect_value;
  Aselect_value += 1;
  funca.appendChild(sel1);

  sel2.id = "Bfunc_dep" + Bselect_value;
  Bselect_value += 1;
  funcb.appendChild(sel2);
}

function refreshFDModal() {
  form_div = document.getElementById('func_dep_form');
  children = form_div.querySelectorAll('option,select,p');

  Array.prototype.forEach.call( children, function( node ) {
      node.parentNode.removeChild( node );
  });
  
  var sel = document.createElement('select');
  sel.id = "func_dep_table";
  var opt;

  opt = document.createElement('option');
  opt.value = '';
  opt.innerHTML = '';
  opt.selected = true;
  sel.appendChild(opt);

  sel.addEventListener(
    'change',
    function(){
      populateFD();
    },
    false
    ); 

  for(var i=0;i<nodeDataArray.length;i++){
    opt = document.createElement('option');
    opt.value = nodeDataArray[i].key;
    opt.innerHTML = nodeDataArray[i].key;
    sel.appendChild(opt);
  }
  global_table_sel = sel;
  document.getElementById('functable').appendChild(sel);
}

function loadFDModal() {
  $.when(refreshFDModal()).then($('#func_dep').overlay().load());
}

function closeFuncDepModal() {
  $('#func_dep').overlay().close();
}

function addFD() {
  var str1 = '';
  var str2 = '';

  var func, val;

  for(var i=0;i<Aselect_value;i++) {
    func = document.getElementById('Afunc_dep'+i);
    val = func.options[func.selectedIndex].text;

    str1+=val;
    if(i!=Aselect_value-1) {
      str1+=',';
    }

  }

  for(var i=0;i<Bselect_value;i++) {
    func = document.getElementById('Bfunc_dep'+i);
    val = func.options[func.selectedIndex].text;

    str2+=val;
    if(i!=Bselect_value-1) {
      str2+=',';
    }
  }
  Aselect_value = 0;
  Bselect_value = 0;

  // current_table = '';

  var func_str = str1 + '~' + str2;

  if(typeof entities[current_table] !== 'undefined' && entities[current_table].length > 0) {
    entities[current_table].push(func_str);
  } else {
    entities[current_table] = [];
    entities[current_table].push(func_str);
  }
  current_table
  closeFuncDepModal();
}

/////////////////////////////
//// Relation functions /////
/////////////////////////////

function changeOptions() {
  for_length = 0;
  var foreign = document.getElementById('toTable');
  var val = foreign.options[foreign.selectedIndex].text;

  var form_div = document.getElementById('relation_form');
  children = form_div.querySelectorAll("[id^='foreignkey'],p");
  
  Array.prototype.forEach.call( children, function( node ) {
      node.parentNode.removeChild( node );
  });

  // children = form_div.querySelectorAll("p");
  // Array.prototype.forEach.call( children, function( node ) {
  //     node.parentNode.removeChild( node );
  // });
  
  var primary = document.getElementById('fromTable');
  primary = primary.options[primary.selectedIndex].text;

  var indexes, keycount;
  var pkeys = [];

  keycount = $.map(nodeDataArray, function(obj, index) {
      var count=0;
      if(obj.key == primary) {
          for(var i=0;i<obj.items.length;i++) {
            if(obj.items[i].iskey == 'True' || obj.items[i].iskey == true) {
              count++;
              pkeys.push(obj.items[i].name)
            }
          }
        return count;
      }
  });

  keycount = keycount[0];

  indexes = $.map(nodeDataArray, function(obj, index) {
      if(obj.key == val) {
          return index;
      }
  });

  var idx = indexes[0];
  var opt;
  var sel = document.createElement('select');

  for(var i=0;i<nodeDataArray[idx].items.length;i++) {
    opt = document.createElement('option');
    opt.value = nodeDataArray[idx].items[i].name;
    opt.selected = '';
    opt.innerHTML = nodeDataArray[idx].items[i].name;
    sel.appendChild(opt);    
  }

  for(var j=0;j<keycount;j++) {
    var temp = sel.cloneNode(true);
    temp.id = 'foreignkey' + j;
    for_length += 1;
    form_div.appendChild(temp);
  }

  var z;
  z = document.createElement('p');
  z.innerHTML = 'label for:';
  form_div.appendChild(z);

  for(var i=0;i<pkeys.length;i++) {
    z = document.createElement('p');
    z.innerHTML = pkeys[i];
    form_div.appendChild(z);
  }
}

/**
 * Refreshes relation modal
 */
function refreshRelationModal() {
  form_div = document.getElementById('relation_form');
  children = form_div.querySelectorAll('input, option, select, label, p');
  
  Array.prototype.forEach.call( children, function( node ) {
      node.parentNode.removeChild( node );
  });

  var sel = document.createElement('select');
  var opt;

  opt = document.createElement('option');
  opt.value = '';
  opt.innerHTML = '';
  opt.selected = true;
  sel.appendChild(opt);  

  for(var i=0;i<nodeDataArray.length;i++){
    opt = document.createElement('option');
    opt.value = nodeDataArray[i].key;
    opt.innerHTML = nodeDataArray[i].key;
    sel.appendChild(opt);
  }

  var sel1 = sel.cloneNode(true);
  var sel2 = sel.cloneNode(true);

  sel1.id = 'toTable';
  sel2.id = 'fromTable';

  sel1.addEventListener(
    'change',
    function(){
      changeOptions();
    },
    false
    );

  sel2.addEventListener(
    'change',
    function(){
      changeOptions();
    },
    false
    );   

  form_div.appendChild(sel1);
  form_div.appendChild(sel2);
}

function addRelation(linkData) {
  linkDataArray.push(linkData);
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

/**
 * Loads relation modal dialog screen
 */
function loadRelationModal(){
  $.when(refreshRelationModal()).then($('#relation_prompt').overlay().load());
}

function closeRelationModal() {
$('#relation_prompt').overlay().close();
}

////////////////////////////////////////
/////// DELETE TABLE FUNCTIONS /////////
////////////////////////////////////////

function loadDeleteModal() {
$('#del').overlay().load();
}

function closeDeleteModal() {
$('#del').overlay().close();
}

function deleteTable() {
  var indexes = $.map(linkDataArray, function(obj, index) {
      if(obj.from == current_table || obj.to == current_table) {
          return index;
      }
  });

  for(var i=indexes.length-1;i>=0;i--) {
    myDiagram.model.removeLinkData(linkDataArray[indexes[i]])
  }

  indexes = $.map(nodeDataArray, function(obj, index) {
      if(obj.key == current_table) {
          return index;
      }
  });

  delete entities[current_table];

  myDiagram.model.removeNodeData(nodeDataArray[indexes[0]]);

  current_table = '';
  closeDeleteModal();
}

////////////////////////////////////////
///////// MODAL REFRESH FUNCTIONS //////
////////////////////////////////////////

/** 
 * Create option list for datatype containing values
 * NEED TO ADD MORE OPTIONS
 */
function type_select(){
  var sel = document.createElement('select');
  sel.id = count_attr;
  sel.className = 'datatype';

  var opt1 = document.createElement('option');
  opt1.value="int";
  opt1.selected = "";
  opt1.innerHTML = "int";

  var opt2 = document.createElement('option');
  opt2.value = "varchar";
  opt2.selected = "";
  opt2.innerHTML = "varchar";

  var opt3 = document.createElement('option');
  opt3.value = "date";
  opt3.selected = "";
  opt3.innerHTML = "date";  

  sel.appendChild(opt1);
  sel.appendChild(opt2);
  sel.appendChild(opt3);

  return sel;
}

/**
 * Create check option for given string
 */
function add_checkbox(checkbox_for){
  var checkbox = document.createElement('input');
  checkbox.type = "checkbox";
  checkbox.name = checkbox_for;
  checkbox.id = count_attr;
  checkbox.className = checkbox_for;

  return checkbox;
}

/**
 * Adds a new attribute to the input modal
 */
function addAttribute(){
 var form = document.getElementById('tattr');

 var element = document.createElement('input');
 element.id = count_attr;
 element.className = 'attribute_name';
 form.appendChild(element);

 var typ, null_checkbox, uniq_checkbox, pk_checkbox, close_button;

 form.appendChild(document.createTextNode( '\u00A0' )); 
 $.when(typ = type_select()).then(form.appendChild(typ));
 form.appendChild(document.createTextNode( '\u00A0' ));
 $.when(null_checkbox = add_checkbox('notNULL')).then(form.appendChild(null_checkbox));
 form.appendChild(document.createTextNode( '\u00A0' ));
 $.when(uniq_checkbox = add_checkbox('isUnique')).then(form.appendChild(uniq_checkbox));
 form.appendChild(document.createTextNode( '\u00A0' ));
 $.when(pk_checkbox = add_checkbox('isPK')).then(form.appendChild(pk_checkbox));

 form.appendChild(document.createElement('br'));
 form.appendChild(document.createElement('br'));

 count_attr+=1;
}

/**
 * Updates the modal as required
 */
function refreshModal(){
  count_attr = 0;
  form_div = document.getElementById('modalform');
  children = form_div.querySelectorAll('input,br,option,select');

  Array.prototype.forEach.call( children, function( node ) {
      node.parentNode.removeChild( node );
  });

  var inp = document.createElement('input');
  inp.id = 'table_name';
  
  var tdiv = document.getElementById('tname');

  tdiv.appendChild(document.createElement('br'));
  tdiv.appendChild(inp);
  tdiv.appendChild(document.createElement('br'));
  tdiv.appendChild(document.createElement('br'));
}

/**
 * Loads table modal dialog screen
 */
function loadModal(){
  flag = 0;
  $.when(refreshModal()).then($('#prompt').overlay().load());
}

///////////////////////////////////////////
////////// ADD TABLE FUNCTIONS ////////////
///////////////////////////////////////////

/**
 * Updates modal dialog input 
 */
function updateModal(tableData){
  $('#table_name').val(tableData.table_name);
  $('#attribute').val(tableData.attribute);
  flag = 1;
  refreshModal();
  $('.modal').overlay().load();
}

/**
 * Gets data from modal dialog
 */
function getNewData(){
  return { table_name: $('#table_name').val(), attribute: $('#attribute').val()};
}

/**
 * Updates existing entries
 */
function modifyTable(tableData){
  var table_name = tableData.table_name;
  var index = nodeDataArray.map(function(e) { return e.key; }).indexOf(table_name);

  tableData = getNewData();

  nodeDataArray[index].key = tableData.table_name;
  nodeDataArray[index].items[0].name = tableData.attribute;

  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

/**
 * Adds a new table
 */
function addTable(tableData){
    var name = tableData['table_name'];
    if(name == '' || name.indexOf(' ') > -1) {
      return false;
    }
    else {
      var attributes = tableData['attribute'];
      var items_array = [];
      var temp = {};

      for(var i=0;i<attributes.length;i++){
        if(attributes[i].attribute_name == '' || attributes[i].attribute_name.indexOf(' ') > -1) {
        }
        else {
          temp['name'] = attributes[i].attribute_name;
          temp['iskey'] = attributes[i].isPK;
          temp['figure'] = "Decision";
          temp['color'] = yellowgrad;
          if(temp['iskey'] == 'True') {
            temp['color'] = greengrad;
          }
          temp['datatype'] = attributes[i].datatype;
          temp['notNULL'] = attributes[i].notNULL;
          temp['isUnique'] = attributes[i].isUnique;
          items_array.push(temp);
          temp = {};          
        }
      }

      nodeDataArray.push({
          key: name,
          items: items_array,
      });
      myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  }
}

function closeModal() {
$('#prompt').overlay().close();
}

/////////////////////////////////////
/////////// GENERATE JSON ///////////
/////////////////////////////////////

function setJSON() {
  var json = {};
  var entity = {};
  var attr;
  json["entities"] = [];
  json["relations"] = [];

  for(var i=0;i<nodeDataArray.length;i++) {
    entity['name'] = nodeDataArray[i].key;
    entity['attributes'] = [];
    entity['fds'] = entities[nodeDataArray[i].key];
    if(typeof entity['fds'] == 'undefined') {
      entity['fds'] = [];
    }
    attr = {};
    for(var j=0;j<nodeDataArray[i].items.length;j++) {
      attr['name'] = nodeDataArray[i].items[j].name;
      attr['datatype'] = nodeDataArray[i].items[j].datatype;
      attr['notNULL'] = nodeDataArray[i].items[j].notNULL;
      attr['isUnique'] = nodeDataArray[i].items[j].isUnique;
      
      if(nodeDataArray[i].items[j].iskey == true || nodeDataArray[i].items[j].iskey == 'True')
        attr['isPK'] = 'True';
      else
        attr['isPK'] = 'False';

      entity['attributes'].push(attr);
      attr = {};
    }
    json['entities'].push(entity);
    entity = {};
  }

  attr = {};
  for(var i=0;i<linkDataArray.length;i++) {
    attr['from'] = linkDataArray[i].from;
    attr['to'] = linkDataArray[i].to;
    attr['PK'] = linkDataArray[i].PK;
    attr['FK'] = linkDataArray[i].FK;
    json['relations'].push(attr);
    attr = {};
  }
  copy_json = json;
  s = JSON.stringify(json);

}

///////////////////////////////////////////
///// FUNCTION CALL FOR SQL Query Gen /////
///////////////////////////////////////////

function closesqlModal() {
  $('#sql').overlay().close();
}

function generateSQL() {
  $.when(setJSON()).then(
    $.ajax({
      type: 'post',
      url: "http://localhost:5000/api/sql/",
      contentType: "application/json",
      async: false,
      data: s,
      success: function(data) {
        var div = document.getElementById('sqlstatement');
        div.innerHTML = '';

        div.innerHTML += data;
        
        $("#sql").overlay().load();
      }
    })
  )
}

///////////////////////////////////////////
///// FUNCTION CALL FOR NORMALIZATION /////
///////////////////////////////////////////

function normalizeTables() {
  $.when(setJSON()).then(
    $.ajax({
      type: 'post',
      url: "http://localhost:5000/api/normalize/",
      contentType: "application/json",
      async: false,
      data: s,
      success: function(data) {
        var div = document.getElementById('sqlstatement');
        div.innerHTML = '';

        div.innerHTML += data;
        
        $("#sql").overlay().load();
      }
    })
  )
}

////////////////////////////////////////////
////////// UPDATE DIAGRAM //////////////////
////////////////////////////////////////////

function newDiagram() {
  $.when(setJSON()).then(
    $.ajax({
      type: 'post',
      url: "http://localhost:5000/api/normalize/diagram",
      contentType: "application/json",
      async: false,
      data: s,
      success: function(data) {
        save_data = nodeDataArray;
        save_link = linkDataArray;
        data = data.replace(/'/g, '"');
        data = $.parseJSON(data);
        updateDiagram(data);
      }
    })
  )
}

function updateDiagram(data) {
  entities = [];
  linkDataArray = [];
  nodeDataArray = [];

  entity_list   = data['entities'];
  relation_list = data['relations'];

  temp = {};
  item = {};
  for(var i=0;i<entity_list.length;i++) {
      temp['key'] = entity_list[i].name;
      temp['items'] = [];
      if(typeof entity_list[i].attributes !== 'undefined') {
        for(var j=0;j<entity_list[i].attributes.length;j++) {
            item['name'] = entity_list[i].attributes[j].name;
            item['datatype'] = entity_list[i].attributes[j].datatype;
            item['notNULL'] = entity_list[i].attributes[j].notNULL;
            item['isUnique'] = entity_list[i].attributes[j].isUnique;
            
            if(entity_list[i].attributes[j].isPK == 'True')
                item['iskey'] = true;
            else
                item['iskey'] = false;

            item['figure'] = "Decision";

            item['color'] = yellowgrad;
            if(item['iskey']) {
              item['color'] = greengrad;
            }
            temp['items'].push(item);
            item = {};
        }
      }
      nodeDataArray.push(temp);
      temp = {};
  }

  temp = {};
  item = {};
  for(var i=0;i<relation_list.length;i++) {
      temp['from'] = relation_list[i].to;
      temp['to'] = relation_list[i].from;
      temp['PK'] = relation_list[i].PK;
      temp['FK'] = relation_list[i].FK;
      linkDataArray.push(temp);
      temp = {};
  }
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

//////////////////////////////////////////////
///////////// DOCUMENT READY FUNCTION ////////
//////////////////////////////////////////////

/**
 * Binds addTable() function to modal submit at document.ready()
 */
$(document).ready(function() {
    $(".modal").overlay({
      closeOnClick: false,
      api: true
    });
  
    $("#prompt form").submit(function(e) {
      /* User Input */
      var name = $('#table_name').val();
      var temp_attr;
      var attributes = [];
      var key_val = {};

      /* Collect all attributes */
      for(var i=0;i<count_attr;i++){
        temp_attr = $("[id="+i+"]");
        for(var j=0;j<temp_attr.length;j++){
          if(temp_attr[j].className == 'attribute_name' || temp_attr[j].className == 'datatype')
            key_val[temp_attr[j].className] = temp_attr[j].value;
          else {
            if(temp_attr[j].checked)
              key_val[temp_attr[j].className] = 'True';
            else
              key_val[temp_attr[j].className] = 'False';
          }
        }
        attributes.push(key_val);
        key_val = {};
      }
      addTable({table_name: name, attribute: attributes});  

      $("#prompt").overlay().close();
      this.reset();

      /* Do not submit the form */
      return e.preventDefault();
  });

  $("#relation_prompt form").submit(function(e) {
    var temp = {};
    temp['from'] = document.getElementById('fromTable').value;
    temp['to'] = document.getElementById('toTable').value;
    // temp['text'] = document.getElementById('relation_type').value;

    var indexes = $.map(nodeDataArray, function(obj, index) {
        if(obj.key == document.getElementById('fromTable').value) {
            return index;
        }
    });

    var str = '';
    var temp_1 = $.map(nodeDataArray[indexes[0]].items, function(obj, index) {
        if(obj.iskey == 'True' || obj.iskey == true) {
            str += obj.name;
            str += ',';
            return obj.name;
        }
    });

    temp['PK'] = str;
    str = '';

    for(var i=0;i<for_length;i++) {
      var foreign = document.getElementById('foreignkey'+i);
      var val = foreign.options[foreign.selectedIndex].text;

      str += val;
      str += ',';
    }

    temp['FK'] = str;
    addRelation(temp);

    $("#relation_prompt").overlay().close();
    this.reset();

    return e.preventDefault();

  });
});

//////////////////////////////////////////
/////// INITIALIZER FUNCTIONS ////////////
//////////////////////////////////////////

/* GoJS object initializer */
function init() {
  /* Creating a GoJS object */
  var GO = go.GraphObject.make;

  myDiagram =
    GO(go.Diagram, "myDiagram",
      {
        initialContentAlignment: go.Spot.Center,
        allowDelete: false,
        allowCopy: false,
        layout: GO(go.ForceDirectedLayout),
        "undoManager.isEnabled": true
      });

  /* Template for each attribute in a node's array of item data */
  var itemTempl =
    GO(go.Panel, "Horizontal",
      GO(go.Shape,
        { desiredSize: new go.Size(10, 10) },
        new go.Binding("figure", "figure"),
        new go.Binding("fill", "color")),
      GO(go.TextBlock,
        { stroke: "#333333",
          font: "bold 14px sans-serif" },
        new go.Binding("text", "name"))
    );

  /* Define the Node template, representing an entity */
  myDiagram.nodeTemplate =
    GO(go.Node, "Auto",  // the whole node panel
      { selectionAdorned: true,
        resizable: true,
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        isShadowed: true,
        shadowColor: "#C5C1AA" },
      new go.Binding("location", "location").makeTwoWay(),
      // define the node's outer shape, which will surround the Table
      GO(go.Shape, "Ellipse",
        { fill: lightgrad, stroke: "#756875", strokeWidth: 3 }),
      GO(go.Panel, "Table",
        { margin: 8, stretch: go.GraphObject.Fill },
        GO(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
        // the table header
        GO(go.TextBlock,
          {
            row: 0, alignment: go.Spot.Center,
            margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
            font: "bold 16px sans-serif"
          },
          new go.Binding("text", "key")),
        // the collapse/expand button
        GO("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
          { row: 0, alignment: go.Spot.TopRight }),
        // the list of Panels, each showing an attribute
        GO(go.Panel, "Vertical",
          {
            name: "LIST",
            row: 1,
            padding: 3,
            alignment: go.Spot.TopLeft,
            defaultAlignment: go.Spot.Left,
            stretch: go.GraphObject.Horizontal,
            itemTemplate: itemTempl
          },
          new go.Binding("itemArray", "items"))
      )  // end Table Panel
    );  // end Node

  /* Define the Link template, representing a relationship */
  myDiagram.linkTemplate =
    GO(go.Link,  // the whole link panel
      {
        selectionAdorned: true,
        layerName: "Foreground",
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver
      },
      GO(go.Shape,  // the link shape
        { stroke: "#303B45", strokeWidth: 2.5 }),
      GO(go.TextBlock,  // the "from" label
        {
          textAlign: "center",
          font: "bold 14px sans-serif",
          stroke: "#1967B3",
          segmentIndex: 0,
          segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright
        },
        new go.Binding("text", "text")),
      GO(go.TextBlock,  // the "to" label
        {
          textAlign: "center",
          font: "bold 14px sans-serif",
          stroke: "#1967B3",
          segmentIndex: -1,
          segmentOffset: new go.Point(NaN, NaN),
          segmentOrientation: go.Link.OrientUpright
        },
        new go.Binding("text", "toText"))
    );

    myDiagram.addDiagramListener("ObjectDoubleClicked",
      function(e) {
        current_table = e.subject.part.data.key;
        loadDeleteModal();
    });

  /**
    create the model for the E-R diagram
    Array.prototype.push.apply(nodeDataArray, [
      { key: "Products",
        items: [ { name: "ProductID", iskey: true, figure: "Decision", color: yellowgrad }
    ]);
    Array.prototype.push.apply(linkDataArray, [
      { from: "Products", to: "Suppliers", text: "0..N", toText: "1" },
    ]);
  */
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}