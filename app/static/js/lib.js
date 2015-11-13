/**
  * Declaring global variables and arrays
  */
var nodeDataArray = [];
var linkDataArray = [];
var tableArray = [];
var flag = 0;
var count_attr = 0;
var myDiagram, yellowgrad, bluegrad, greengrad, redgrad, lightgrad ;
declareColors();

/**
 * Update table with multiple attributes
 * Add different diagrams to different attributes
 * Add primary key contraints to relations
 */

 function closeRelationModal() {
  $('#relation_prompt').overlay().close();
 }

 function closeModal() {
  $('#prompt').overlay().close();
 }

/* Define several shared brushes */
function declareColors()
{
  yellowgrad = go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
  bluegrad   = go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
  greengrad  = go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
  redgrad    = go.GraphObject.make(go.Brush, "Linear", { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
  lightgrad  = go.GraphObject.make(go.Brush, "Linear", { 1: "#E6E6FA", 0: "#FFFAF0" });
}

/** 
 * Create option list for datatype containing values
 * 1. int
 * 2. varchar
 * NEED TO ADD MORE OPTIONS
 */
function type_select(){
  var sel = document.createElement('select');
  sel.id = count_attr;
  sel.className = 'data_type';

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
 var form = document.getElementById('modalform');

 var element = document.createElement('input');
 element.id = count_attr;
 element.className = 'attribute_name';
 form.appendChild(element);

 var typ, null_checkbox, uniq_checkbox, pk_checkbox, close_button;

 $.when(typ = type_select()).then(form.appendChild(typ));
 $.when(null_checkbox = add_checkbox('notNULL')).then(form.appendChild(null_checkbox));
 $.when(uniq_checkbox = add_checkbox('isUnique')).then(form.appendChild(uniq_checkbox));
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

  form_div.appendChild(document.createElement('br'));
  form_div.appendChild(inp);
  form_div.appendChild(document.createElement('br'));
  form_div.appendChild(document.createElement('br'));
}

/**
 * Loads table modal dialog screen
 */
function loadModal(){
  flag = 0;
  $.when(refreshModal()).then($('#prompt').overlay().load());
}

function changeOptions(val) {
  debugger
  // var sel = document.getElementById('foreignkey');
  var form_div = document.getElementById('relation_form');
  var primary = document.getElementById('fromTable').value;

  // children = sel.querySelectorAll('option');
  
  // Array.prototype.forEach.call( children, function( node ) {
  //     node.parentNode.removeChild( node );
  // });
  var indexes, keycount;

  keycount = $.map(nodeDataArray, function(obj, index) {
      var count=0;
      if(obj.key == primary) {
          for(var i=0;i<obj.items.length;i++) {
            if(obj.items[i].iskey == true)
              count++;
          }
        return count;
      }
  });

  indexes = $.map(nodeDataArray, function(obj, index) {
      if(obj.key == val) {
          return index;
      }
  });

  var idx = indexes[0];
  var opt;

  for(var i=0;i<nodeDataArray[idx].items.length;i++) {
    opt = document.createElement('option');
    opt.value = nodeDataArray[idx].items[i].name;
    opt.selected = '';
    opt.innerHTML = nodeDataArray[idx].items[i].name;
    sel.appendChild(opt);    
  }
}

function changeLabel(val) {
}
/**
 * Refreshes relation modal
 */
function refreshRelationModal() {
  form_div = document.getElementById('relation_form');
  children = form_div.querySelectorAll('input, option, select, label');
  
  Array.prototype.forEach.call( children, function( node ) {
      node.parentNode.removeChild( node );
  });

  var sel = document.createElement('select');
  var opt;

  for(var i=0;i<nodeDataArray.length;i++){
    opt = document.createElement('option');
    opt.value = nodeDataArray[i].key;;
    opt.selected = '';
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
      changeOptions(this.value);
    },
    false
    );

  sel2.addEventListener(
    'change',
    function(){
      changeLabel(this.value);
    },
    false
    );   

  form_div.appendChild(sel1);
  form_div.appendChild(sel2);

  var relation_type = document.createElement('select');
  relation_type.id = 'relation_type';

  var type1 = document.createElement('option');
  type1.innerHTML = '0..N';
  type1.value = '0..N';
  type1.selected = '';

  var type2 = document.createElement('option');
  type2.innerHTML = '1..N';
  type2.value = '1..N';
  type2.selected = '';

  var type3 = document.createElement('option');
  type3.innerHTML = 'M..N';
  type3.value = 'M..N';
  type3.selected = '';

  var primary = document.createElement('label');
  primary.id = ''
  primary.innerHTML = '';

  // var foreign = document.createElement('select');
  // foreign.id = 'foreignkey';

  relation_type.appendChild(type1);
  relation_type.appendChild(type2);
  relation_type.appendChild(type3);

  form_div.appendChild(relation_type);
  form_div.appendChild(primary);
  // form_div.appendChild(foreign);

}

/**
 * Loads relation modal dialog screen
 */
function loadRelationModal(){
  $.when(refreshRelationModal()).then($('#relation_prompt').overlay().load());
}

/**
 * Checks if type of update is add/edit
 */
function checkTypeOfUpdate(e) {
  if(flag == 0)
    addTable(e);
  else
    modifyTable(e);
}

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
    if(name == '') {
      return false;
    }
    else {
      var attributes = tableData['attribute'];
      var items_array = [];
      var temp = {};

      for(var i=0;i<attributes.length;i++){
        if(attributes[i].attribute_name != '') {
          temp['name'] = attributes[i].attribute_name;
          temp['iskey'] = attributes[i].isPK;
          temp['figure'] = "Decision";
          temp['color'] = yellowgrad;
          temp['data_type'] = attributes[i].data_type;
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

function addRelation(linkData) {
  linkDataArray.push(linkData);
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

/**
 * Function call to generate SQL
 */
function generateSQL() {
  var json = {};
  var entity = {};
  var attr;
  json["entitites"] = [];
  json["relations"] = [];

  for(var i=0;i<nodeDataArray.length;i++) {
    entity['name'] = nodeDataArray[i].key;
    entity['attributes'] = [];
    attr = {};
    for(var j=0;j<nodeDataArray[i].items.length;j++) {
      attr['name'] = nodeDataArray[i].items[j].name;
      attr['datatype'] = nodeDataArray[i].items[j].data_type;
      attr['notNULL'] = nodeDataArray[i].items[j].notNULL;
      attr['isUNIQUE'] = nodeDataArray[i].items[j].isUnique;
      attr['isPK'] = nodeDataArray[i].items[j].iskey;
      entity['attributes'].push(attr);
      attr = {};
    }
  }

  attr = {};
  for(var i=0;i<linkDataArray.length;i++) {
    attr['from'] = linkDataArray[i].from;
    attr['to'] = linkDataArray[i].to;
    attr['type'] = linkDataArray[i].text;
    json['relations'].push(attr);
    attr = {};
  }
  debugger
  console.log(json);

  $.ajax({
    type: "POST",
    url: "http://localhost:5000/api/sql/",
    data: json,
    success: function(data) {
      alert("Hello!");
    }
  });
}

/**
 * Binds checkTypeOfUpdate() function to modal submit at document.ready()
 */
$(document).ready(function() {
    $(".modal").overlay({

      /* Mask tweaks suitable for modal dialogs */
      // mask: {
      //   color: '#ebecff',
      //   loadSpeed: 200,
      //   opacity: 0.9
      // },

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
          if(temp_attr[j].className == 'attribute_name' || temp_attr[j].className == 'data_type')
            key_val[temp_attr[j].className] = temp_attr[j].value;
          else
            key_val[temp_attr[j].className] = temp_attr[j].checked;
        }
        attributes.push(key_val);
        key_val = {};
      }

      /* Add multiple attribute support */

      checkTypeOfUpdate({table_name: name, attribute: attributes});  

      /* console.log(input); */
      $("#prompt").overlay().close();
      this.reset();

      /* Do not submit the form */
      return e.preventDefault();
  });

  $("#relation_prompt form").submit(function(e) {
    var temp = {};
    temp['from'] = document.getElementById('fromTable').value;
    temp['to'] = document.getElementById('toTable').value;
    temp['text'] = document.getElementById('relation_type').value;

    addRelation(temp);

    $("#relation_prompt").overlay().close();
    this.reset();

    return e.preventDefault();
    // { from: "Products", to: "Suppliers", text: "0..N", toText: "1" }

  });
});

/*************************************************************************************************************
**************************************************************************************************************
**************************************************************************************************************
**************************************************************************************************************
**************************************************************************************************************
**************************************************************************************************************
**************************************************************************************************************
**************************************************************************************************************
*/


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
        var table_name = e.subject.part.data.key;
        var attribute  = e.subject.part.data.items[0].name;
        updateModal({'table_name': table_name, 'attribute': attribute});
        // if (!(part instanceof go.Link))
    });

  // create the model for the E-R diagram
  // Array.prototype.push.apply(nodeDataArray, [
  //   { key: "Products",
  //     items: [ { name: "ProductID", iskey: true, figure: "Decision", color: yellowgrad }
  //              { name: "ProductName", iskey: false, figure: "Cube1", color: bluegrad },
  //              { name: "SupplierID", iskey: false, figure: "Decision", color: "purple" },
  //              { name: "CategoryID", iskey: false, figure: "Decision", color: "purple" } ] },
  // ]);
  // Array.prototype.push.apply(linkDataArray, [
  //   { from: "Products", to: "Suppliers", text: "0..N", toText: "1" },
  //   { from: "Products", to: "Categories", text: "0..N", toText: "1" },
  //   { from: "Order Details", to: "Products", text: "0..N", toText: "1" }
  // ]);
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}