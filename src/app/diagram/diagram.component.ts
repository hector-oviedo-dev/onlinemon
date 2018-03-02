import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {
  public diagram: go.Diagram = new go.Diagram();

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  public objectwidth = 50;

  private events: EventsService;

  @Input()
  public area:string = "";

  public activated:boolean = false;

  private started:boolean = false;

  public filters = [];
  constructor(private services:ServicesService) {
    this.events = services.events;

    this.events.subscribe("onFilter", (data) => this.onFilter(data));
    this.events.subscribe("onUpdate", (data) => this.onUpdate(data));
  }
  public onFilter(data) {
    this.filters = [];
    for (let i = 0; i < data.length;i++) {

      for (let j = 0; j < data[i].values.length;j++)
      {
        this.filters.push({propertyname:data[i].values[j].propertyname,value:data[i].values[j].value,check:data[i].values[j].check})
      }

    }
    this.doFilters();
  }
  public onUpdate(data) {
    this.diagram.requestUpdate();
  }
  ngOnInit() {
    this.start();
  }
  @HostListener('change') ngOnChanges() {

   }
  public doStart() {
    //if (!this.started) this.start();

    this.diagram.requestUpdate();
  }
  public start() {
    this.activated = true;

    const $ = go.GraphObject.make;
    const that = this;

    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;

    this.diagram.maxSelectionCount = 999;
    this.diagram.undoManager.isEnabled = false;
    this.diagram.toolManager.hoverDelay = 1;
    this.diagram.allowDrop = false;
    this.diagram.allowMove = true;
    this.diagram.allowCopy = false;
    this.diagram.allowDelete = false;
    this.diagram.allowInsert = false;

    this.diagram.addDiagramListener("SelectionMoved", (e) => this.SelectionMoved(e));
    this.diagram.addDiagramListener("PartRotated", (e) => this.PartRotated(e));

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
              { click: (e, obj) => this.onAlignVertical(e, obj) }),
      //Alinear Vertical
      $("ContextMenuButton",
              $(go.TextBlock, "Distribuir Horizontalmente"),
              { click: (e, obj) => this.onAlignPropHorizontal(e, obj) }),
      //Alinear Vertical
      $("ContextMenuButton",
              $(go.TextBlock, "Distribuir Verticalmente"),
              { click: (e, obj) => this.onAlignPropVertical(e, obj) }),
      )


    this.diagram.nodeTemplate =
    $(go.Node,"Auto",
      {
        selectionAdorned: false,
        selectionChanged: function (obj) { that.onSelectionChanged(obj); },
        doubleClick: function (e, obj) { that.onClick(e, obj); },
      },
      new go.Binding("name", "uid"),
      new go.Binding("visible", "visible"),
      //Fondo
      $(go.Shape, "Rectangle",
        {
          stroke:null,
          fill:null,
          width:50,
          height:130,
        },
      ),
      //Fondo
      $(go.Shape, "Rectangle",
        new go.Binding("fill", "color"),
        {
          name:"bg",
          stroke:"gray",
          width:this.objectwidth,
          height:this.objectwidth,
        },
      ),
      //Fondo
      $(go.Shape, "Circle",
        new go.Binding("fill", "conncolor"),
        {
          margin: new go.Margin(0,35,35,0),
          width:10,
          height:10,
        },
      ),
      //Texto con UID
      $(go.TextBlock, { margin: 2 },
        new go.Binding("text", "uid"),
      ),
      //Silla
      $(go.Picture,
        {
          source: "assets/chair.png",
          width:35,
          height:35,
          margin: new go.Margin(90,0,0,0),
        }
      ),
      //ToolTip
      {
        toolTip:
          $(go.Adornment, "Auto",
          $(go.Shape, { fill: "darkgray" }),
          $(go.Panel, "Vertical",
            $(go.TextBlock, { margin: 3 }, new go.Binding("text", "uid")),
            $(go.TextBlock, { margin: 3 }, new go.Binding("text", "label_state")),
            $(go.TextBlock, { margin: 3 }, new go.Binding("text", "ip")),
          )
        )
      },
      //Context Menu
      {
        contextMenu:
          $(go.Adornment, "Vertical",
          //Ver Detalles
          $("ContextMenuButton",
            $(go.TextBlock, "Ver Detalle"),
            { click: (e, obj) => this.onDetail(e, obj) }
            ),
          //Modificar
          $("ContextMenuButton",
            $(go.TextBlock, "Online"),
            { click: (e, obj) => this.onOnline(e, obj) }
            ),
          //Offline Programado
          $("ContextMenuButton",
            $(go.TextBlock, "Offline Programado"),
            { click: (e, obj) => this.onProgOffline(e, obj) }
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
    let positionOBJ = new go.Point(-100,0);
    this.diagram.toolManager.rotatingTool.handleArchetype = $(go.Shape, "Circle", {position:positionOBJ, width: 10, stroke: "green", fill: "blue" });

    this.diagram.div = this.diagramRef.nativeElement;
    this.events.subscribe("onSearch",(data) => this.onSearch(data));
    this.events.subscribe("onMachines",(data) => this.onMachines(data));

    this.events.publish("getMachines",'');
  }
  public onSelectionChanged(obj) {
    var bg = obj.findObject("bg");
    if (bg !== null) {
      if (obj.isSelected)
        bg.stroke = "blue";
      else
        bg.stroke = "gray";
    }
  }
  public SelectionMoved(e) {
    let obj = this.diagram.selection.first() as any;
    if (!obj) return;

    let actualUID = obj.Zd.uid;
    let actualX = parseInt(obj.location.x);
    let actualY = parseInt(obj.location.y);
    let actualR = parseInt(obj.angle);

    obj.Zd.loc.x = actualX;
    obj.Zd.loc.y = actualY;
    obj.Zd.angle = actualR;

    let msg = { uid:actualUID, loc:{ x:actualX, y:actualY }, angle:actualR };
    //this.services.sendMessage(JSON.stringify(msg));

    let msgArr = [];

    let selection = this.diagram.selection.toArray();

    for (let i = 0; i < selection.length; i++) {
      let obj = selection[i] as any;
      if (!obj) return;

      let actualUID = obj.Zd.uid;
      let actualX = parseInt(obj.location.x);
      let actualY = parseInt(obj.location.y);
      let actualR = parseInt(obj.angle);

      obj.Zd.loc.x = actualX;
      obj.Zd.loc.y = actualY;
      obj.Zd.angle = actualR;

      msgArr.push({ uid:actualUID, loc:{ x:actualX, y:actualY }, angle:actualR });

/*
      let data = new URLSearchParams("");
      data.set('uid', actualUID);
      data.set('pos_x', actualX.toString());
      data.set('pos_y', actualY.toString());
      data.set('angle', actualR.toString());*/


      let data = {
        uid:actualUID,
        pos_x:actualX,
        pos_y:actualY,
        angle:actualR,
      }
      this.services.doPost("update", data).subscribe(
          res => { this.onUpdateResult(res); },
          err => { }
        );
    }
    //console.log(JSON.stringify(msgArr))
    //this.services.sendMessage(JSON.stringify(msgArr));
  }
  public onUpdateResult(res) {
    console.log(res)
  }
  public PartRotated(e) {
    let obj = e.subject;
    if (!obj) return;

    let actualUID = obj.Zd.uid;
    let actualX = parseInt(obj.location.x);
    let actualY = parseInt(obj.location.y);
    let actualR = parseInt(obj.angle);

    obj.Zd.loc.x = actualX;
    obj.Zd.loc.y = actualY;
    obj.Zd.angle = actualR;

    let msg = { uid:actualUID, loc:{ x:actualX, y:actualY }, angle:actualR };

    //this.services.sendMessage(JSON.stringify(msg));
    let data = {
      uid:actualUID,
      pos_x:actualX,
      pos_y:actualY,
      angle:actualR,
    }
    this.services.doPost("update", data).subscribe(
        res => { this.onUpdateResult(res); },
        err => { }
      );
  }
  //Agregar Nueva Maquina
  public onAddMachine(e, obj) {
    let loc = e.diagram.toolManager.contextMenuTool.mouseDownPoint;

    let dataSTR = "?userid="+ " " + "&area=" + this.area + "&xpos=" + parseInt(loc.x) + "&ypos=" + parseInt(loc.y);

    let data = { service:"getAltaForm"+dataSTR,data:null };
    this.events.publish("onPopup", data);
    /*
    let diagram = e.diagram;
    let loc = diagram.toolManager.contextMenuTool.mouseDownPoint;
    diagram.startTransaction('new node');
    let data = { uid:"000001", label_state: "offline", loc: { x:loc.x, y:loc.y }, color: "red", angle:0 };
    diagram.model.addNodeData(data);
    let part = diagram.findPartForData(data);
    part.location = diagram.toolManager.contextMenuTool.mouseDownPoint;
    diagram.commitTransaction('new node');

    this.diagram.requestUpdate();*/
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

     //this.services.sendMessage(JSON.stringify(msg));
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

         //this.services.sendMessage(JSON.stringify(msg));
       }
     }
    }
  }
  //Ver Detalles
  public onDetail(e,obj) {
    let dataSTR = "?userid="+ " " + "&uid=" + obj.part.Zd.uid;
    let data = { service:"onDetail"+dataSTR,data:null };
    this.events.publish("onPopup", data);
  }
  //Modificar
  public onOnline(e,obj) {
    let dataSTR = "?userid="+ " " + "&uid=" + obj.part.Zd.uid + "&state=1";
    let data = { data:obj.part.Zd.uid, service:"getOfflineProgForm"+dataSTR };
    this.events.publish("onPopup", data);
  }
  //Online Programado
  public onProgOffline(e,obj) {
    let dataSTR = "?userid="+ " " + "&uid=" + obj.part.Zd.uid + "&state=0";
    let data = { data:obj.part.Zd.uid, service:"getOfflineProgForm"+dataSTR };
    this.events.publish("onPopup", data);
  }
  //Online Programado
  public onBaja(e,obj) {
    let dataSTR = "?userid="+ " " + "&uid=" + obj.part.Zd.uid;

    let data = { service:"getBajaForm"+dataSTR,data:null };
    this.events.publish("onPopup", data);
  }
  public onClick(e, obj) {
    let data = { data:obj.part.Zd.uid, service:"onDetail" };
    this.events.publish("onPopup", data);
  }
  public onAlignHorizontal(e, ob) {
    let selection = this.diagram.selection.toArray();
    let y = this.diagram.selection.first().position.y;
    for (let i = 0; i < selection.length; i++) {
      (selection[i] as any).position = new go.Point(selection[i].location.x - selection[i].actualBounds.width/2, y);
    }
    this.SelectionMoved(null);
  }
  public onAlignVertical(e, ob) {
    let selection = this.diagram.selection.toArray();
    let x = this.diagram.selection.first().position.x;
    for (let i = 0; i < selection.length; i++) {
      (selection[i] as any).position = new go.Point(x, selection[i].location.y - selection[i].actualBounds.height/2);
    }
    this.SelectionMoved(null);
  }
  public onAlignPropHorizontal(e, ob) {
    let selectionDis = this.diagram.selection.toArray();

    let selection = this.sort_by_key_value(selectionDis,'position.x');

    let xfirst = selection[0].position.x;

    let xlast = selection[selection.length-1].position.x;

    let diff = xlast - xfirst;

    let pos = diff / (selection.length-1);

    for (let i = 0; i < selection.length; i++) {
      let x = xfirst + pos * i;
      (selection[i] as any).position = new go.Point(x, selection[i].location.y - selection[i].actualBounds.height/2);
    }
    this.SelectionMoved(null);
  }
  public onAlignPropVertical(e, ob) {
    let selectionDis = this.diagram.selection.toArray();

    let selection = this.sort_by_key_value(selectionDis,'position.y');

    let yfirst = selection[0].position.y;

    let ylast = selection[selection.length-1].position.y;

    let diff = ylast - yfirst;

    let pos = diff / (selection.length-1);

    for (let i = 0; i < selection.length; i++) {
      let y = yfirst + pos * i;
      (selection[i] as any).position = new go.Point(selection[i].location.x - selection[i].actualBounds.width/2,y);
    }
    this.SelectionMoved(null);
  }
  private sort_by_key_value(arr, key) {
  var to_s = Object.prototype.toString;
  var valid_arr = to_s.call(arr) === '[object Array]';
  var valid_key = typeof key === 'string';

  if (!valid_arr || !valid_key) {
    return;
  }

  arr = arr.slice();

  return arr.sort(function(a, b) {
    var a_key = String(a[key]);
    var b_key = String(b[key]);
    var n = (a_key as any) - (b_key as any);
    return !isNaN(n) ? n : a_key.localeCompare(b_key);
  });
}


  public doFilters() {
    let found:boolean = false;
    for (let i = 0; i < this.diagram.model.nodeDataArray.length; i++) {
      let actualOBJ = this.diagram.model.nodeDataArray[i] as any;

      let node = this.diagram.findNodeForKey(actualOBJ.key);
      node.visible = true;

      for (var k = 0; k < this.filters.length; k++) {

        let actualFilter = this.filters[k];

        if ((actualOBJ.filters[actualFilter.propertyname] == actualFilter.value)  && !actualFilter.check) {
          node.visible = false;
        }
      }
    }
    this.diagram.requestUpdate();
  }
  public onMachines(dataSTR) {
    if (this.diagram.toolManager.draggingTool.draggedParts) return;

    let data;
    try { JSON.parse(dataSTR); }
    catch (err) { data = dataSTR; }

    const $ = go.GraphObject.make;

    let nodes = [];
    for (let j = 0; j < this.diagram.model.nodeDataArray.length; j++) nodes.push(this.diagram.model.nodeDataArray[j]);

    for (let i = 0; i < data.maquinas.length; i++) {

      let obj = {
        uid:data.maquinas[i].uid,
        label_state:data.maquinas[i].label_state,
        loc: new go.Point(data.maquinas[i].loc.x , data.maquinas[i].loc.y),
        color:data.maquinas[i].color,
        conncolor:"",
        angle:data.maquinas[i].angle,
        area:data.maquinas[i].area,
        ip:data.maquinas[i].ip+":"+data.maquinas[i].port,
        filters:data.maquinas[i].filters,
        visible:true,
      }
      if (!data.maquinas[i].filters.connectionstate) obj.conncolor = "red";
      else obj.conncolor = "green";

      let node;
      let valid:boolean = true;
      for (let j = 0; j < this.diagram.model.nodeDataArray.length; j++) {
        if ((this.diagram.model.nodeDataArray[j] as any).uid == data.maquinas[i].uid) {
          node = this.diagram.model.nodeDataArray[j];
          valid = false;
        }
      }
      if (obj.area == this.area) {
        if (valid) this.addNode(obj, nodes)
        else this.updateNode(obj, node)
      }
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
  public onSearch(data) {
    this.doSearch(data);
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

        /*
        let bg = actualOBJ.port.findObject("bg");
        if (bg !== null) {
          if (actualOBJ.port.isSelected)
            bg.stroke = "blue";
          else
            bg.stroke = "gray";
        }
        */
      }
    }
  }
}
