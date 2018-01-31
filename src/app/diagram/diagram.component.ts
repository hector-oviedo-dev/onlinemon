import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {
  private diagram: go.Diagram = new go.Diagram();

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  public objectwidth = 75;

  private events: EventsService;
  constructor(private services:ServicesService) {
    services.connect();
    this.events = services.events;

    const $ = go.GraphObject.make;
    const that = this;

    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;

    this.diagram.undoManager.isEnabled = true;
    this.diagram.toolManager.hoverDelay = 100;
    //this.diagram.allowSelect = false;
    this.diagram.allowDrop = true;
    this.diagram.allowMove = true;
    this.diagram.allowCopy = false;
    this.diagram.allowDelete = false;
    this.diagram.allowInsert = false;
    //this.diagram.toolManager.rotatingTool = new RotateMultipleTool();

    //this.diagram.addDiagramListener("ObjectSingleClicked", (e) => this.onClick(e));
    //this.diagram.addDiagramListener("SelectionMoved", (e) => this.onDrop(e));

    this.diagram.nodeTemplate =
    $(go.Node,"Auto",
      {
        //isActionable:true,
        //allowDrop:true,
        mouseOver: function (e, obj) { that.onDrop({ data:obj.part.Zd, loc:obj.part.location }); },
        doubleClick: function (e, obj) { that.onClick({ data:obj.part.Zd, loc:obj.part.location }); }
      },
      new go.Binding("location", "loc"),
      {
        locationSpot: go.Spot.Center,
      },
      $(go.Shape, "Circle",
      {
        width:this.objectwidth,
      },
        new go.Binding("fill", "color"),
        new go.Binding("angle", "angle").makeTwoWay(),
        ),
        $(go.TextBlock, { margin: 3 },
          new go.Binding("text", "uid"),
          new go.Binding("angle", "angle")
        ),
      {
        toolTip:
          $(go.Adornment, "Auto",
          $(go.Shape, { fill: "lightyellow" }),
          $(go.Panel, "Vertical",
            $(go.TextBlock, { margin: 3 },
              new go.Binding("text", "uid")),
            $(go.TextBlock, { margin: 3 },
              new go.Binding("text", "state"))
          )
        )
      }
    );

    this.diagram.toolManager.rotatingTool.handleArchetype =
        $(go.Shape, "XLine",
          { width: 8, height: 8, stroke: "green", fill: "transparent" });

    this.populate(null);
  }
  public onClick(data) {
   //console.log("on click " + data.data.uid);
   this.events.publish("onPopup", data)
  }
  public setNode(uid) {
    let found:boolean = false;
    for (let i = 0; i < this.diagram.model.nodeDataArray.length; i++) {
      let actualOBJ = this.diagram.model.nodeDataArray[i] as any;
      if (actualOBJ.uid == uid) {
        let actualX = parseInt(actualOBJ.loc.x);
        let actualY = parseInt(actualOBJ.loc.y);

        let rect = this.diagram.viewportBounds;

        let x = actualX - rect.width/2;
        let y = actualY - rect.height/2;

        let point  = new go.Point(x,y)
        this.diagram.position = point;
      }
    }
    this.setFilter("brand","IGT")
  }
  public setFilter(type ,value) {
    let found:boolean = false;
    for (let i = 0; i < this.diagram.model.nodeDataArray.length; i++) {
      let actualOBJ = this.diagram.model.nodeDataArray[i] as any;
      if (actualOBJ[type] == value) {
        console.log( type + " found at " + JSON.stringify(this.diagram.model.nodeDataArray[i]));
        (this.diagram.model.nodeDataArray[i] as any).visible = false;
      } else (this.diagram.model.nodeDataArray[i] as any).visible = true;
    }
  }
  public onDrop(e) {
   //console.log("on drop");
   for (let i = 0; i < this.diagram.model.nodeDataArray.length; i++) {
     let actualOBJ = this.diagram.model.nodeDataArray[i] as any;
     if (actualOBJ.uid == e.data.uid) {
       let actualX = parseInt(e.loc.x);
       let actualY = parseInt(e.loc.y);

       if (actualX != actualOBJ.loc.x && actualY != actualOBJ.loc.y) {
         console.log("THIS HAS BEEN MOVED");
         (this.diagram.model.nodeDataArray[i] as any).loc.x = actualX;
         (this.diagram.model.nodeDataArray[i] as any).loc.y = actualY;

         this.services.sendMessage(JSON.stringify(actualOBJ));
       }
     }
   }
   this.diagram.clearSelection();
  }
  public populate(data) {
    data = {
      machines:[
        { uid:"000001", state: "online", details:"Maquina Online", loc: { x:0, y:0 }, color: "green", brand:"IGT", angle:0 },
        { uid:"000002", state: "offline", details:"Maquina Offline", loc: { x:50, y:0 }, color: "red", brand:"WILLIAMS",angle:0 },
        { uid:"000003", state: "online", details:"Maquina Online", loc: { x:100, y:0 }, color: "green", brand:"IGT",angle:0 },
        { uid:"000004", state: "online", details:"Maquina Online", loc: { x:150, y:0 }, color: "green", brand:"BALLI",angle:0 },
        { uid:"000005", state: "offline", details:"Maquina Offline", loc: { x:0, y:50 }, color: "red", brand:"WILLIAMS",angle:0 },
        { uid:"000006", state: "online", details:"Maquina Online", loc: { x:0, y:100 }, color: "green", brand:"IGT",angle:0 },
        { uid:"000007", state: "offline", details:"Maquina: Puerta Abierta", loc: { x:0, y:150 }, color: "yellow", brand:"BALLI",angle:0 },
        { uid:"000008", state: "online", details:"Maquina Online", loc: { x:0, y:200 }, color: "green", brand:"WILLIAMS",angle:0 }
      ]
    }

    const $ = go.GraphObject.make;

    let arr = JSON.parse(JSON.stringify(data));

    let nodes = [];
    for (let i = 0; i < arr.machines.length;i++) {
      let obj = {
        uid:arr.machines[i].uid,
        state:arr.machines[i].state,
        loc: new go.Point(arr.machines[i].loc.x , arr.machines[i].loc.y),
        color:arr.machines[i].color,
        angle:arr.machines[i].angle
      }
      nodes.push(arr.machines[i]);
    }
    this.diagram.model.nodeDataArray = nodes;

    //background image
    this.diagram.add(
    $(go.Part,
      { layerName: "Background", position: new go.Point(0, 0),
        selectable: false, pickable: false },
      $(go.Picture, "https://upload.wikimedia.org/wikipedia/commons/9/9a/Sample_Floorplan.jpg")
    ));


  }
  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    this.events.subscribe("onSearch",(data) => this.onSearch(data));
  }
  public onSearch(data) {
    this.setNode(data);
    console.log("llega evento: " + data)
  }
}
