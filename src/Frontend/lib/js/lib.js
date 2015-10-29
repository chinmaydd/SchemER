/**
  * Declaring global variables and arrays
  */
var nodeDataArray = [];
var linkDataArray = [];
var flag = 0;
var myDiagram, yellowgrad, bluegrad, greengrad, redgrad, lightgrad ;
declareColors();

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
 * Loads modal dialog screen
 */
function loadModal(){
  flag = 0;
  $('.modal').overlay().load();
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
  debugger

  nodeDataArray[index].key = tableData.table_name;
  nodeDataArray[index].items[0].name = tableData.attribute;

  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

/**
 * Adds a new table
 */
function addTable(tableData){
    var name = tableData['table_name'];
    var attribute = tableData['attribute'];

    nodeDataArray.push({
        key: name,
        items: [{name: attribute, iskey: false, figure: "Decision", color: yellowgrad}],
    });
    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

/**
 * Binds checkTypeOfUpdate() function to modal submit at document.ready()
 */
$(document).ready(function() {
    $(".modal").overlay({

      /* Mask tweaks suitable for modal dialogs */
      mask: {
        color: '#ebecff',
        loadSpeed: 200,
        opacity: 0.9
      },

      closeOnClick: false,
      api:true
    });
  
    $("#prompt form").submit(function(e) {
      /* User Input */
      var name = $('#table_name').val();
      var attribute = $('#attribute').val();
      checkTypeOfUpdate({table_name: name, attribute: attribute});  

      /* console.log(input); */
      $(".modal").overlay().close();
      this.reset();

      /* Do not submit the form */
      return e.preventDefault();
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