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

  public objectwidth = 40;
  public objectheight = 80;
  public objectspace = 5;
  public objectmax = 50;

  private events: EventsService;

  @Input()
  public area:string = "";

  @Input() set bg(value) {
    if (!value) return;
    const $ = go.GraphObject.make;
    //background image
    this.diagram.add(
    $(go.Part,
      { layerName: "Background", position: new go.Point(0, 0),
        selectable: false, pickable: false },
      $(go.Picture, value)
    ));
  };

  @Input() set bgColor(value) {
    if (!value) return;
    this.bgcol = value;
  };

  public activated:boolean = false;

  private started:boolean = false;

  public bgcol = "#CCCCCC";

  public filters = [];
  constructor(private services:ServicesService) {
    const $ = go.GraphObject.make;
    this.diagram = new go.Diagram();

    this.events = services.events;

    this.events.subscribe("onView",(data) => this.onView(data));
    this.events.subscribe("onFilter", (data) => this.onFilter(data));
    this.events.subscribe("onUpdate", (data) => this.onUpdate(data));
    this.events.subscribe("onBlock", (data) => this.onBlock(data));
    this.events.subscribe("onPrivileges", (data) => this.onPrivileges(data));
  }
  public onView(data) {
    this.services.viewmode = data;
    this.services.getMachines();
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
  public onBlock(data) {
    if (data && this.area !="general") {

      this.diagram.allowMove = true;

      for (let i = 0; i < this.diagram.model.nodeDataArray.length; i++) {

        let actualOBJ = this.diagram.model.nodeDataArray[i] as any;

        let obj = this.diagram.findNodeForKey(actualOBJ.key);

        var bg = obj.findObject("bg") as any;
        bg.fill = "#FFFFFF";

        var bgconn = obj.findObject("bgconn") as any;
        bgconn.fill = "#FFFFFF";
      }


    } else {
      this.diagram.allowMove = false;

      this.services.getMachines(false);
    }

    this.diagram.toolManager.rotatingTool.isEnabled = this.diagram.allowMove;
  }
  public onPrivileges(data) {
    if (!data.position) this.diagram.allowMove = false;
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

    this.diagram.initialContentAlignment = go.Spot.Center;

    this.diagram.maxSelectionCount = 20;
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
          stroke:null,
          width:35.5,
          height:27,
          margin: new go.Margin(0,0,12,0),
        },
      ),
      //Fondo
      $(go.Shape, "Rectangle",
        new go.Binding("fill", "conncolor"),
        {
          name:"bgconn",
          margin: new go.Margin(0,0,28.5,19),
          width:14,
          height:7.5,
          stroke:null
        },
      ),
      //Texto con UID
      $(go.TextBlock, { margin: 1 },
        new go.Binding("text", "idbox"),
      ),
      //Silla
      $(go.Picture,
        new go.Binding("source", "imgsource"),
        {
          name:"img",
          width:40,
          height:70,
          margin: new go.Margin(25,0,0,0),
        }
      ),
      $(go.Shape, "Rectangle",
        {
          name:"selectionstroke",
          margin: new go.Margin(25,0,0,0),
          width: 40,
          height: 70,
          fill: null,
          stroke: null,
        },
      ),
      //ToolTip
      {
        toolTip:
          $(go.Adornment, "Auto",
          $(go.Shape, { fill: "darkgray" }),
          $(go.Panel, "Vertical",
            $(go.TextBlock, { margin: 3 }, new go.Binding("text", "uid")),
            $(go.TextBlock, { margin: 3 }, new go.Binding("text", "idbox")),
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
          //Acciones
          $("ContextMenuButton",
            $(go.TextBlock, "Acciones"),
            { click: (e, obj) => this.onActions(e, obj) },

            ),
          //Modificar
          $("ContextMenuButton",
            $(go.TextBlock, new go.Binding("text", "offline_prog_label")),
            { click: (e, obj) => this.onChangeState(e, obj) },

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
    this.events.publish("getPrivileges",'');

    //HARDCODED block movement at first time
    this.diagram.allowMove = false;
    this.diagram.toolManager.rotatingTool.isEnabled = this.diagram.allowMove;
  }
  public onSelectionChanged(obj) {
    var bg = obj.findObject("selectionstroke");
    bg.strokeWidth = 2;
    if (bg !== null) {
      if (obj.isSelected) bg.stroke = "blue";
      else bg.stroke = null;
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

    let selection = this.diagram.selection.toArray();

    let datas = [];
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

      let data = {
        uid:actualUID,
        pos_x:actualX,
        pos_y:actualY,
        angle:actualR,
      }

      datas.push(data);
    }

    this.services.doPost("update", datas).subscribe(
        res => { this.onUpdateResult(res); },
        err => { this.events.publish("onError", "404 Server Error"); }
      );
  }
  public onUpdateResult(result) {
    console.log(JSON.stringify(result))
    if (result.success == false) this.events.publish("onError", result.message);
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

    let data = {
      uid:actualUID,
      pos_x:actualX,
      pos_y:actualY,
      angle:actualR,
    }
    let datas = [];
    datas.push(data);
    this.services.doPost("update", datas).subscribe(
        res => { this.onUpdateResult(res); },
        err => { this.events.publish("onError", "404 Server Error"); }
      );
  }
  //Agregar Nueva Maquina
  public onAddMachine(e, obj) {
    let loc = e.diagram.toolManager.contextMenuTool.mouseDownPoint;

    let dataSTR = "?userid="+ " " + "&area=" + this.area + "&xpos=" + parseInt(loc.x) + "&ypos=" + parseInt(loc.y);

    let data = { service:"getAltaForm"+dataSTR,data:null };
    this.events.publish("onPopup", data);
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
       }
     }
    }
  }
  //Ver Detalles
  public onDetail(e, obj) {
    let dataSTR = "?userid="+ " " + "&uid=" + obj.part.Zd.uid;
    let data = { service:"onDetail"+dataSTR,data:null };
    this.events.publish("onPopup", data);
  }
  //Acciones
  public onActions(e, obj) {
    let dataSTR = "?userid="+ " " + "&uid=" + obj.part.Zd.uid;
    let data = { data:obj.part.Zd.uid, service:"getActionForm"+dataSTR };
    this.events.publish("onPopup", data);
  }
  //Modificar
  public onChangeState(e, obj) {
    let dataSTR = "?userid="+ " " + "&uid=" + obj.part.Zd.uid;
    let data = { data:obj.part.Zd.uid, service:"getChangeStateForm"+dataSTR };
    this.events.publish("onPopup", data);
    /*
    if (obj.part.Zd.offline_prog_param == "00003") {
      let dataSTR = "?userid="+ " " + "&uid=" + obj.part.Zd.uid + "&state=" +obj.part.Zd.offline_prog_param;
      let data = { data:obj.part.Zd.uid, service:"getOfflineProgForm"+dataSTR };
      this.events.publish("onPopup", data);
    } else {
      this.events.publish("onSpinner", true);

      let data = [
        {
          id:"uid",
          value:obj.part.Zd.uid,
        },
        {
          id:"state",
          value:obj.part.Zd.offline_prog_param,
        }
      ];

      this.services.doPost("offlineprog",data).subscribe(
        data => {
          this.events.publish("onSpinner", false);
          this.services.getMachines();
          this.diagram.requestUpdate();
          console.log(data);
        },
        err => {
          let data = { "MESSAGE":"404 Server Address" }
          //this.navCtrl.push(ErrorPage, data);
          console.log(data);
        }
      );

    }
    */
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
    if (!this.diagram.allowMove) return;

    let selection = this.diagram.selection.toArray();
    let y = this.diagram.selection.first().position.y;
    for (let i = 0; i < selection.length; i++) {
      (selection[i] as any).position = new go.Point(selection[i].location.x - selection[i].actualBounds.width/2, y);
    }
    this.SelectionMoved(null);
  }
  public onAlignVertical(e, ob) {
    if (!this.diagram.allowMove) return;

    let selection = this.diagram.selection.toArray();
    let x = this.diagram.selection.first().position.x;
    for (let i = 0; i < selection.length; i++) {
      (selection[i] as any).position = new go.Point(x, selection[i].location.y - selection[i].actualBounds.height/2);
    }
    this.SelectionMoved(null);
  }
  public onAlignPropHorizontal(e, ob) {
    if (!this.diagram.allowMove) return;

    let selectionDis = this.diagram.selection.toArray();

    let selection = this.sort_by_key_value(selectionDis,'position.x');

    let xfirst = selection[0].position.x;

    for (let i = 0; i < selection.length; i++) if (selection[i].position.x < xfirst) xfirst = selection[i].position.x;

    let xlast = selection[0].position.x;

    for (let i = 0; i < selection.length; i++) if (selection[i].position.x > xlast) xlast = selection[i].position.x;

    let diff = xlast - xfirst;

    let pos = diff / (selection.length-1);

    for (let i = 0; i < selection.length; i++) {
      let x = xfirst + pos * i;
      (selection[i] as any).position = new go.Point(x, selection[i].location.y - selection[i].actualBounds.height/2);
    }
    this.SelectionMoved(null);
  }
  public onAlignPropVertical(e, ob) {
    if (!this.diagram.allowMove) return;

    let selectionDis = this.diagram.selection.toArray();

    let selection = this.sort_by_key_value(selectionDis,'position.y');

    let yfirst = selection[0].position.y;

    for (let i = 0; i < selection.length; i++) if (selection[i].position.y < yfirst) yfirst = selection[i].position.y;

    let ylast = selection[0].position.y;

    for (let i = 0; i < selection.length; i++) if (selection[i].position.y > ylast) ylast = selection[i].position.y;

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

    let ExilonSTEP = 0;
    let yExilon = 0;
    for (let i = 0; i < data.maquinas.length; i++) {

      let obj = {
        idbox:data.maquinas[i].filters["IDBox"],
        uid:data.maquinas[i].uid,
        label_state:data.maquinas[i].label_state,
        loc: new go.Point(data.maquinas[i].loc.x , data.maquinas[i].loc.y),
        color:"#FFFFFF",
        conncolor:"#FFFFFF",
        angle:data.maquinas[i].angle,
        area:data.maquinas[i].area,
        ip:data.maquinas[i].ip+":"+data.maquinas[i].port,
        filters:data.maquinas[i].filters,
        visible:true,
        offline_prog_label:"",
        offline_prog_param:0,
        imgsource:""
      }

      if (!data.maquinas[i].filters["ImagenMonitoreo"] || data.maquinas[i].filters["ImagenMonitoreo"] == "null" || data.maquinas[i].filters["ImagenMonitoreo"] == "undefined" || data.maquinas[i].filters["ImagenMonitoreo"] == "") obj.imgsource = "assets/puesto.png";
      else  obj.imgsource = "assets/" + data.maquinas[i].filters["ImagenMonitoreo"];

      let arrTMP = data.maquinas[i].filters.CambioEstado.split(",");

      //HARDCODED
      obj.offline_prog_label = arrTMP[0];
      obj.offline_prog_param = arrTMP[1];
      obj.offline_prog_label = "Cambiar Estado";

      //cambio de fondo en modo de vista
      if (this.services.viewmode == "VistaEstado") {

        obj.conncolor = data.maquinas[i].color;
        if (parseInt(data.maquinas[i].filters.Online) == 0) obj.color = data.maquinas[i].filters["OnlineColor"];
        else obj.color = data.maquinas[i].filters["OnlineColor"];

      } else {
        obj.color = data.maquinas[i].color;
        if (parseInt(data.maquinas[i].filters.Online) == 0) obj.conncolor = data.maquinas[i].filters["OnlineColor"];
        else obj.conncolor = data.maquinas[i].filters["OnlineColor"];
      }

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


      if (this.area == "general") {
        obj.angle = 0;
        obj.loc.x = ExilonSTEP * (this.objectwidth + this.objectspace);
        obj.loc.y = yExilon * (this.objectheight + this.objectspace);

        if (valid) this.addNode(obj, nodes)
        else this.updateNode(obj, node)

        ExilonSTEP++;
        if (ExilonSTEP >= this.objectmax) {
          yExilon++;
          ExilonSTEP = 0;
        }
      }
    }
    this.diagram.model.nodeDataArray = nodes;

    //for (let j = 0; j < this.diagram.model.nodeDataArray.length; j++) this.updateNode(this.diagram.model.nodeDataArray[j]);

    if (this.area == "general") {
      this.diagram.allowMove = false;
      this.diagram.toolManager.rotatingTool.isEnabled = false;
      this.diagram.contextMenu = null;
    }

    this.doFilters();

    this.diagram.requestUpdate();
  }
  public addNode(obj, nodes) {
    nodes.push(obj);
  }
  public updateNode(obj, node) {
    node.label_state = obj.label_state;
    node.offline_prog_label = obj.offline_prog_label;
    node.offline_prog_param = obj.offline_prog_param;
    node.loc = obj.loc;
    node.color = obj.color;
    node.angle = obj.angle;
    node.conncolor = obj.conncolor;
  }
  public onSearch(data) {
    this.doSearch(data);
  }
  //Buscar
  public doSearch(data) {
    let params = data.split(",");
    for (let i = 0; i < this.diagram.model.nodeDataArray.length; i++) {
      let actualOBJ = this.diagram.model.nodeDataArray[i] as any;
      if (actualOBJ.filters[params[0]] == params[1]) {

        let actualX = parseInt(actualOBJ.loc.x);
        let actualY = parseInt(actualOBJ.loc.y);

        let rect = this.diagram.viewportBounds;

        let x = actualX - rect.width/2;
        let y = actualY - rect.height/2;

        let point  = new go.Point(x,y)
        this.diagram.position = point;

        let obj = this.diagram.findNodeForKey(actualOBJ.key);

        var bg = obj.findObject("selectionstroke");
        (bg as any).stroke = "blue";
        (bg as any).strokeWidth = 2;

        this.events.publish("SearchFound", actualOBJ.area);

        break;
      }
    }
  }
}
