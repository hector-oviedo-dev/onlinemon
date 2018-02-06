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

    //Context Menu
    this.diagram.contextMenu =
      $(go.Adornment, "Vertical",
      //Guardar Posicion
      $("ContextMenuButton",
              $(go.TextBlock, "Agregar Maquina"),
              { click: (e, obj) => this.onAddMachine(e, obj) }),

      //Alinear Horizontal
      $("ContextMenuButton",
              $(go.TextBlock, "Alinear Horizontalmente"),
              { click: (e, obj) => this.onAlignHorizontal(e, obj) }),
      //Alinear Vertical
      $("ContextMenuButton",
              $(go.TextBlock, "Alinear Verticalmente"),
              { click: (e, obj) => this.onAlignVertical(e, obj) })

      )


    this.diagram.nodeTemplate =
    $(go.Node,"Auto",
      {
        mouseOver: function (e, obj) { that.onSavePositionInstant(e, obj); },
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
  }
  //Agregar Nueva Maquina
  public onAddMachine(e, obj) {
    let diagram = e.diagram;
    let loc = diagram.toolManager.contextMenuTool.mouseDownPoint;
    diagram.startTransaction('new node');
    let data = { uid:"000001", label_state: "offline", loc: { x:loc.x, y:loc.y }, color: "red", angle:0 };
    diagram.model.addNodeData(data);
    let part = diagram.findPartForData(data);
    part.location = diagram.toolManager.contextMenuTool.mouseDownPoint;
    diagram.commitTransaction('new node');
  }
  //Guardar Posicion
  public onSavePositionInstant(e, obj) {
   let actualX = parseInt(obj.part.location.x);
   let actualY = parseInt(obj.part.location.y);
   let actualR = parseInt(obj.part.angle);

   let oldX = obj.part.Zd.loc.x;
   let oldY = obj.part.Zd.loc.y;
   let oldR = obj.part.Zd.angle;

   if (actualX != oldX || actualY != oldY || actualR != oldR) {
     obj.part.Zd.loc.x = actualX;
     obj.part.Zd.loc.y = actualY;
     obj.part.Zd.angle = actualR;
     let msg = { uid:obj.part.Zd.uid, loc:{ x:actualX, y:actualY }, angle:actualR }

     this.services.sendMessage(JSON.stringify(msg));
   }
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
    //this.events.publish("onPopup",)
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
  }
  public onAlignHorizontal(e, ob) {
    let selection = this.diagram.selection.toArray();
    let y = 0;
    for (let i = 0; i < selection.length; i++) {

      if (i == 0) y = selection[i].location.y;

      (selection[i] as any).position = new go.Point(selection[i].location.x - this.objectwidth/2, y);

    }
  }
  public onAlignVertical(e, ob) {
    let selection = this.diagram.selection.toArray();
    let x = 0;
    for (let i = 0; i < selection.length; i++) {

      if (i == 0) x = selection[i].location.x;

      (selection[i] as any).position = new go.Point(x, selection[i].location.y - this.objectwidth/2);

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

    //console.log("onMachines" + JSON.stringify(data.maquinas))
    /*
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
    */
    let nodes = [];
    for (let j = 0; j < this.diagram.model.nodeDataArray.length; j++) nodes.push(this.diagram.model.nodeDataArray[j]);

    for (let i = 0; i < data.maquinas.length; i++) {
      let obj = {
        uid:data.maquinas[i].uid,
        label_state:data.maquinas[i].label_state,
        loc: new go.Point(data.maquinas[i].loc.x , data.maquinas[i].loc.y),
        color:data.maquinas[i].color,
        angle:data.maquinas[i].angle
      }

      let node;
      let valid:boolean = true;
      for (let j = 0; j < this.diagram.model.nodeDataArray.length; j++) {
        if ((this.diagram.model.nodeDataArray[j] as any).uid == data.maquinas[i].uid) {
          node = this.diagram.model.nodeDataArray[j];
          valid = false;
        }
      }
      if (valid) this.addNode(obj, nodes)
      else this.updateNode(obj, node)
    }
    this.diagram.model.nodeDataArray = nodes;

    //for (let j = 0; j < this.diagram.model.nodeDataArray.length; j++) this.updateNode(this.diagram.model.nodeDataArray[j]);

    //background image
    this.diagram.add(
    $(go.Part,
      { layerName: "Background", position: new go.Point(0, 0),
        selectable: false, pickable: false },
      $(go.Picture, "https://upload.wikimedia.org/wikipedia/commons/9/9a/Sample_Floorplan.jpg")
    ));
  }
  public addNode(obj, nodes) {
    nodes.push(obj);
  }
  public updateNode(obj, node) {
    node.label_state = obj.label_state;
    node.loc = obj.loc;
    node.color = obj.color;
    node.angle = obj.angle;
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
  //Buscar
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
}
