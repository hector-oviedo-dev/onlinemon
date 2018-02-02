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

  public objectwidth = 50;

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
    this.diagram.allowDrop = true;
    this.diagram.allowMove = true;
    this.diagram.allowCopy = false;
    this.diagram.allowDelete = false;
    this.diagram.allowInsert = false;

    //this.diagram.addDiagramListener("ObjectSingleClicked", (e) => this.onClick(e));
    //this.diagram.addDiagramListener("SelectionMoved", (e) => this.onDrop(e));

    this.diagram.nodeTemplate =
    $(go.Node,"Auto",
      {
        //mouseOver: function (e, obj) { that.onDrop({ data:obj.part.Zd, loc:obj.part.location, r:obj.part.angle }); },
        doubleClick: function (e, obj) { that.onClick(e, obj); }
      },
      //Fondo
      $(go.Shape, "Rectangle",
        new go.Binding("fill", "color"),
        {
          width:this.objectwidth,
          height:this.objectwidth,
        },

      ),
      //Texto con UID
      $(go.TextBlock, { margin: 2 },
        new go.Binding("text", "uid"),
      ),
      //ToolTip
      {
        toolTip:
          $(go.Adornment, "Auto",
          $(go.Shape, { fill: "lightyellow" }),
          $(go.Panel, "Vertical",
            $(go.TextBlock, { margin: 3 }, new go.Binding("text", "uid")),
            $(go.TextBlock, { margin: 3 }, new go.Binding("text", "label_state"))
          )
        )
      },
      //Context Menu
      {
        contextMenu:
          $(go.Adornment, "Vertical",
          //Guardar Posicion
          $("ContextMenuButton",
            $(go.TextBlock, "Salvar Posicion"),
            { click: (e, obj) => this.onSavePosition(e, obj) }
            ),
          //Ver Detalles
          $("ContextMenuButton",
            $(go.TextBlock, "Ver Detalles"),
            { click: (e, obj) => this.onDetails(e, obj) }
            ),
          //SPACE
          $("ContextMenuButton", $(go.TextBlock, "-") ),
          //Modificar
          $("ContextMenuButton",
            $(go.TextBlock, "Modificar"),
            { click: (e, obj) => this.onModify(e, obj) }
            ),
          //Online Programado
          $("ContextMenuButton",
            $(go.TextBlock, "Online Programado"),
            { click: (e, obj) => this.onProgOffline(e, obj) }
            ),
          //Offline Programado
          $("ContextMenuButton",
            $(go.TextBlock, "Offline Programado"),
            { click: (e, obj) => this.onProgOnline(e, obj) }
            ),
          //Dar de Baja
          $("ContextMenuButton",
            $(go.TextBlock, "Dar de Baja"),
            { click: (e, obj) => this.onBaja(e, obj) }
            ),
          )
      },
      new go.Binding("location", "loc"), { locationSpot: go.Spot.Center, rotatable: true },
      new go.Binding("angle", "angle")
    );
    this.diagram.toolManager.rotatingTool.handleArchetype = $(go.Shape, "Circle", { width: 10, stroke: "green", fill: "blue" });

    this.onMachines(JSON.stringify({maquinas:[]}));
  }
  //Guardar Posicion
  public onSavePosition(e, obj) {

    for (let i = 0; i < this.diagram.model.nodeDataArray.length; i++) {
     if ((this.diagram.model.nodeDataArray[i] as any).uid == obj.part.Zd.uid) {
       let actualX = parseInt(obj.part.location.x);
       let actualY = parseInt(obj.part.location.y);
       let actualR = parseInt(obj.part.adornedPart.angle);

       if (actualX != (this.diagram.model.nodeDataArray[i] as any).loc.x && actualY != (this.diagram.model.nodeDataArray[i] as any).loc.y) {
         (this.diagram.model.nodeDataArray[i] as any).loc.x = actualX;
         (this.diagram.model.nodeDataArray[i] as any).loc.y = actualY;
         (this.diagram.model.nodeDataArray[i] as any).angle = actualR;

         let msg = { uid:obj.part.Zd.uid, loc:{ x:actualX, y:actualY }, angle:actualR }

         this.services.sendMessage(JSON.stringify(msg));
       }
     }
    }
  }
  //Ver Detalles
  public onDetails(e,obj) {
    console.log("context clicked " + obj)
  }
  //Modificar
  public onModify(e,obj) {
    console.log("context clicked " + obj)
  }
  //Online Programado
  public onProgOnline(e,obj) {

  }
  //Online Programado
  public onProgOffline(e,obj) {

  }
  //Online Programado
  public onBaja(e,obj) {

  }
  public onClick(e, obj) {
    let data = obj.part.Zd;
    let location = { x:obj.part.location.x, y:obj.part.location.y };
    let rotation = obj.part.angle;

  }
  public doSearch(uid) {
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
  }

  /*
  public setFilter(type ,value) {
    let found:boolean = false;
    for (let i = 0; i < this.diagram.model.nodeDataArray.length; i++) {
      let actualOBJ = this.diagram.model.nodeDataArray[i] as any;
      if (actualOBJ[type] == value) {
        console.log( type + " found at " + JSON.stringify(this.diagram.model.nodeDataArray[i]));
        (this.diagram.model.nodeDataArray[i] as any).visible = false;
      } else (this.diagram.model.nodeDataArray[i] as any).visible = true;
    }
  }*/
  public onMachines(dataSTR) {
    let data = JSON.parse(dataSTR);

    const $ = go.GraphObject.make;

    console.log("onMachines" + JSON.stringify(data.maquinas))

    data = {
      maquinas:[
        { uid:"000001", label_state: "online", loc: { x:0, y:0 }, color: "green", angle:30 },
        { uid:"000002", label_state: "offline", loc: { x:50, y:0 }, color: "red", angle:0 },
        { uid:"000003", label_state: "online", loc: { x:100, y:0 }, color: "green", angle:0 },
        { uid:"000004", label_state: "online", loc: { x:150, y:0 }, color: "green",angle:0 },
        { uid:"000005", label_state: "offline",loc: { x:0, y:50 }, color: "red", angle:0 },
        { uid:"000006", label_state: "online",loc: { x:0, y:100 }, color: "green", angle:0 },
        { uid:"000007", label_state: "offline", loc: { x:0, y:150 }, color: "yellow", angle:0 },
        { uid:"000008", label_state: "online", loc: { x:0, y:200 }, color: "green", angle:0 }
      ]
    }


    let nodes = [];
    for (let i = 0; i < data.maquinas.length;i++) {
      let obj = {
        uid:data.maquinas[i].uid,
        label_state:data.maquinas[i].label_state,
        loc: new go.Point(data.maquinas[i].loc.x , data.maquinas[i].loc.y),
        color:data.maquinas[i].color,
        angle:data.maquinas[i].angle
      }
      nodes.push(data.maquinas[i]);
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
    this.events.subscribe("onMachines",(data) => this.onMachines(data));
  }
  public onSearch(data) {
    this.doSearch(data);
    console.log("llega evento: " + data)
  }
}
