import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, OnInit, AfterViewInit, Input } from '@angular/core';
import { AutoFormComponent } from '../auto-form/auto-form.component';
import { AutoGridComponent } from '../auto-grid/auto-grid.component';
import { DetailComponent } from '../detail/detail.component';
import { ServicesService } from '../services.service';
import { ErrorComponent } from '../error/error.component';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  @Input()
  public data:any;

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  public components = [];

  public menus = [];

  public service:string;

  private events:EventsService;

  private refresh:boolean = false;
  private content;

  private onChangeEvt;
  private onContentEvt;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,private services:ServicesService) {
    this.events = services.events;
    this.onChangeEvt = this.events.subscribe('onChange', (content) => { this.onChange(content); });
    this.onContentEvt = this.events.subscribe('onContent', (content) => { this.onContent(content); });
  }
  public ngOnDestroy() {
    this.onChangeEvt.unsubscribe();
    this.onContentEvt.unsubscribe();
  }
  public onChange(content) {
    this.service = content;
    this.container.clear();
    this.doStart();
  }
  public onContent(content) {
    this.onServiceResult(content);
  }
  public onServiceResult(data) {
    if (!data.success) {
      this.events.publish("onError", data.message);
      return;
    }

    this.events.publish("onSpinner", false);
    let res = data.json;

    if (res.sections.length) {
      for (var i = 0; res.sections.length > i; i++) {

        if (res.sections[i].type) {

          switch (res.sections[i].type) {
            case "form":
              this.addFormComponent(res.sections[i]);
              break;
            case "grid":
              this.addGridComponent(res.sections[i]);
              break;
            case "detail":
              this.addDetailComponent(res.sections[i]);
              break;
          }
        } else this.events.publish("onError", "Se esperaba en posicion" + i.toString() +" de 'sections' el objeto 'type'");
      }
    } else this.events.publish("onError","Se esperaba array 'sections'");
  }
  public doStart() {
    this.events.publish("onSpinner", true);
    if (!this.services.hardcoded) {
      this.services.doGet(this.service,"").subscribe(
        data => { this.onServiceResult(data); },
        err => { this.events.publish("onError", "404 Server Error"); }
      );
    } else {/*


      this.onServiceResult(res);*/
    }
  }
  public addDetailComponent(data:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DetailComponent);
    const component = this.container.createComponent(componentFactory);

    (<DetailComponent>component.instance).sides         = data.sides;
    (<DetailComponent>component.instance).details       = data.tabs;

    //(<DetailComponent>component.instance).startProcess();

    this.components.push(component);
  }
  ///Add Form View
  public addFormComponent(data:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoFormComponent);
    const component = this.container.createComponent(componentFactory);

    (<AutoFormComponent>component.instance)._action       = data.display.action;

    (<AutoFormComponent>component.instance)._label_title  = data.display.title;
    (<AutoFormComponent>component.instance)._label_submit = data.display.label_submit;
    (<AutoFormComponent>component.instance)._label_cancel = data.display.label_cancel;

    (<AutoFormComponent>component.instance).values        = data.controls;

    (<AutoFormComponent>component.instance).startProcess();

    this.components.push(component);
  }
  public addGridComponent(data:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoGridComponent);
    const component = this.container.createComponent(componentFactory);

    //(<AutoGridComponent>component.instance).startProcess();

    this.components.push(component);
  }

  ngOnInit() {
    //this.doStart();
  }
  public createExample() {
    let form = {
     type:"form",
     controls: [
       {
        "id":"NAME",
        "type":"TEXT",
        "value":"",
        "hidden":false,
        "enabled":true,
        "required":true,
        "txt_required":"Debe ingresar su nombre.",
        "txt_error":"",
        "txt_help":"Ingrese su Nombre",
        "max":15,
        "min":5,
        "mask":"nn-nnnnnnnn-n",
        "format":"ALL",
        "restrict":[],
        "label":"Nombre",
        "placeholder":"Ingrese su Nombre",
        "display":[]
      },
      {
        "id":"DESC",
        "type":"TEXTAREA",
        "value":"",
        "hidden":false,
        "enabled":true,
        "required":true,
        "txt_required":"La descripcion es obligatoria",
        "txt_error":"Por favor verifique el formato",
        "txt_help":"Ingrese una descripcion",
        "max":500,
        "min":10,
        "mask":"",
        "format":"",
        "restrict":["A","B","C","$","1"],
        "label":"Descripcion",
        "placeholder":"Ingrese la descripcion",
        "display":[]
      },
      {
        "id":"CUIT_2",
        "type":"TEXT",
        "value":"",
        "hidden":false,
        "enabled":true,
        "required":true,
        "txt_required":"Este campo es obligatorio",
        "txt_error":"Por favor verifique el formato",
        "txt_help":"Ingrese su cuit o cuil",
        "max":50,
        "min":10,
        "mask":"nn-nnnnnnnn-n",
        "format":"RESTRICT",
        "restrict":["A","B","C","$","1"],
        "label":"CUIL/CUIT",
        "placeholder":"Ingrese su CUIL/CUIT",
        "display":[]
      },
      {
        "id":"EMAIL_ALERT",
        "type":"CHECKBOX",
        "value":true,
        "hidden":false,
        "enabled":true,
        "required":false,
        "txt_help":"Avisar por email una vez registrado.",
        "label":"Avisar por E-mail",
        "check":true
      },
      {
        "id":"PROVINCIA",
        "type":"CHECKBOXLIST",
        "hidden":false,
        "enabled":true,
        "required":false,
        "txt_required":"Este campo es obligatorio",
        "txt_help":"Seleccione las provincias",
        "label":"Seleccionar Provincias",
        "min":1,
        "max":2,
        "servicio":"",
        "values":[
          {
            "label":"Formosa",
            "value":"formosa",
            "check":false
          },
          {
            "label":"Buenos Aires",
            "value":"bsas",
            "check":false
          },
          {
            "label":"Santa Fe",
            "value":"santafe",
            "check":false
          }
        ]
      },
      {
        "id":"PROVINCIA_2",
        "type":"RADIO",
        "hidden":false,
        "enabled":true,
        "required":false,
        "txt_required":"Este campo es obligatorio",
        "txt_help":"Seleccione UNA de las provincias",
        "label":"Seleccionar Provincia Actual",
        "values":[
          {
            "label":"Formosa",
            "value":"formosa",
            "check":false
          },
          {
            "label":"Buenos Aires",
            "value":"bsas",
            "check":false
          },
          {
            "label":"Santa Fe",
            "value":"santafe",
            "check":false
          }
        ]
      },
      {
        "id":"PROVINCIA_3",
        "type":"SELECT",
        "hidden":false,
        "enabled":true,
        "required":false,
        "txt_required":"Este campo es obligatorio",
        "txt_help":"Seleccione UNA de las provincias",
        "label":"Seleccionar Provincia",
        "values":[
          {
            "label":"Formosa",
            "value":"formosa",
            "check":false
          },
          {
            "label":"Buenos Aires",
            "value":"bsas",
            "check":false
          },
          {
            "label":"Santa Fe",
            "value":"santafe",
            "check":false
          }
        ]
      },
    ],
    display: {
      title:"Modificar Maquina",
      action:"postNewData",
      label_submit:"Agregar",
      label_cancel:"Cerrar"
    }
    };

    let grid = {
       type:"grid",
       titles:[
         {
           label:"ROW 1 TITLE"
         },
         {
          label:"ROW 2 TITLE"
        },
        {
          label:"ROW 3 TITLE"
        }
      ],
       rows:[
       {
         cols:[
           {
             type:"text",
             label:"ROW 1 COL 1"
           },
           {
             type:"text",
             label:"ROW 1 COL 2"
           },
           {
             type:"text",
             label:"ROW 1 COL 3"
           }
         ]
       },
       {
         cols:[
           {
             type:"text",
             label:"ROW 2 COL 1"
           },
           {
             type:"text",
             label:"ROW 2 COL 2"
           },
           {
             type:"text",
             label:"ROW 2 COL 3"
           }
         ]
       },
       {
         cols:[
           {
             type:"text",
             label:"ROW 3 COL 1"
           },
           {
             type:"text",
             label:"ROW 3 COL 2"
           },
           {
             type:"text",
             label:"ROW 3 COL 3"
           }
         ]
       }
     ]
    }

    //DETAILS
    let sides = [];
    let tabs = [];


    //CONTENIDO IZQUIERDA
    //LISTA DE 'ROWS'
    sides.push(
      {
        cols:[
          { label:"UID:", width:"33%" },
          { label:"MARCA:", width:"33%" },
          { label:"VC", width:"33%" },
        ]
      },
      {
        cols:[
          { label:"000331", width:"33%", border:"1px solid gray", color:"#ffe4b5" },
          { label:"IGT", width:"33%", border:"1px solid gray", color:"#ffe4b5" },
          { label:"2.0", width:"33%", border:"1px solid gray", color:"#ffe4b5" },
        ]
      }
    );

    //CONTENIDO TAB
    //LISTA DE 'ROWS'
    let dataCont = [
      {
        cols:[
          { label:"Ultima Actualizacion", width:"20%" },
          { label:"03/02/2016 11:52:41", width:"80%", border:"1px solid gray", color:"#ffc0c0" },
        ]
      },
      {
        cols:[
          { label:"COIN IN", width:"25%" },
          { label:"430086", width:"25%", border:"1px solid gray", color:"#ffffc0" },
          { label:"JUGADAS", width:"25%" },
          { label:"263", width:"25%", border:"1px solid gray", color:"#ffffc0" },
        ]
      },
      {
        cols:[
          { label:"COIN OUT", width:"25%" },
          { label:"26471", width:"25%", border:"1px solid gray", color:"#ffffc0" },
          { label:"GANADAS", width:"25%" },
          { label:"112", width:"25%", border:"1px solid gray", color:"#ffffc0" },
        ]
      },
      {
        cols:[
          { label:"HAND PAY", width:"25%" },
          { label:"400000", width:"25%", border:"1px solid gray", color:"#ffffc0" },
          { label:"CANCEL CREDIT", width:"25%" },
          { label:"27359", width:"25%", border:"1px solid gray", color:"#ffffc0" },
        ]
      },
      {
        cols:[
          { label:"DROP", width:"25%" },
          { label:"43978", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
          { label:"APER. PUERTA", width:"25%" },
          { label:"63", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
        ]
      },
      {
        cols:[
          { label:"CRED.ACTUALES", width:"25%" },
          { label:"4", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
          { label:"POWER RESET", width:"25%" },
          { label:"45", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
        ]
      },
      {
        cols:[
          { label:"HOPPER TEOR.", width:"25%" },
          { label:"0", width:"25%", border:"1px solid gray", color:"#d8bfd8" },
          { label:"VF", width:"25%" },
          { label:"0", width:"25%", border:"1px solid gray", color:"#d8bfd8" },
        ]
      },
    ];

    //CONTENIDO TAB
    //LISTA DE 'ROWS'
    let dataBill = [
      {
        cols:[
          { label:"Hora Inicial", width:"25%" },
          { label:"03/02/2016 11:52:41", width:"25%" },
          { label:"Ultima Actualizacion", width:"25%" },
          { label:"03/02/2016 11:52:41", width:"25%" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 2,00", width:"25%" },
          { label:"5", width:"25%",border:"1px solid" },
          { label:"5", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 5,00", width:"25%" },
          { label:"8", width:"25%",border:"1px solid" },
          { label:"8", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 10,00", width:"25%" },
          { label:"10", width:"25%",border:"1px solid" },
          { label:"10", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 20,00", width:"25%" },
          { label:"20", width:"25%",border:"1px solid" },
          { label:"20", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 50,00", width:"25%" },
          { label:"19", width:"25%",border:"1px solid" },
          { label:"19", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 100,00", width:"25%" },
          { label:"5", width:"25%",border:"1px solid" },
          { label:"5", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"", width:"100%" },
        ]
      },
      {
        cols:[
          { label:"", width:"25%" },
          { label:"", width:"25%" },
          { label:"Billetes", width:"25%" },
          { label:"$ 0", width:"25%" },
        ]
      },
    ];


    //CONTENIDO TAB
    //LISTA DE 'ROWS'
    let dataProd = [
        {
          cols:[
            { label:"Hora Inicial", width:"25%" },
            { label:"03/02/2016 11:52:41", width:"25%", border:"1px solid gray", color:"#b0c4de" },
            { label:"Ultima Actualizacion", width:"25%" },
            { label:"03/02/2016 11:52:41", width:"25%", border:"1px solid gray", color:"#b0c4de" },
          ]
        },
        {
          cols:[
            { label:"COIN IN", width:"25%" },
            { label:"430086", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"4000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"5000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"COIN OUT", width:"25%" },
            { label:"430086", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"4000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"5000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"JACK POT", width:"25%" },
            { label:"400000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"234325", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"27359", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"HAND PAY", width:"25%" },
            { label:"400000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"55764", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"27359", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"", width:"25%" },
            { label:"", width:"25%" },
            { label:"PRODUCIDO", width:"25%" },
            { label:"$ 0.00", width:"25%", border:"1px solid gray", color:"#4682b4" },
          ]
        },
        {
          cols:[
            { label:"JUGADAS", width:"25%" },
            { label:"400000", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"55764", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"27359", width:"25%", border:"1px solid gray", color:"#fffacd" },
          ]
        },
        {
          cols:[
            { label:"GANADAS", width:"25%" },
            { label:"400000", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"55764", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"27359", width:"25%", border:"1px solid gray", color:"#fffacd" },
          ]
        },
        {
          cols:[
            { label:"BILL DROP", width:"25%" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#fffacd" },
          ]
        },
        {
          cols:[
            { label:"DROP", width:"25%" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
          ]
        },
      ];

    //CONTENIDO TAB
    //LISTA DE 'ROWS'
    let dataCon = [
        {
          cols:[
            { label:"IP", width:"25%" },
            { label:"10.10.1.102", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
            { label:"Puerto", width:"25%" },
            { label:"1401", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
          ]
        },
      ]

    //CONTENIDO TAB
    //LISTA DE 'ROWS'
    let dataEXT = [
        {
          cols:[
            { label:"", width:"25%" },
            { label:"COIN IN", width:"25%" },
            { label:"", width:"25%" },
            { label:"", width:"25%" },
          ]
        },
        {
          cols:[
            { label:"Juego 01", width:"25%" },
            { label:"16440", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"Match Paid Progr. Win", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"Juego 02", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"Match Paid Ext. Bonus", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"Juego 03", width:"25%" },
            { label:"26646", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"Attend. Paid Prog. Win", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"Juego 04", width:"25%" },
            { label:"26646", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"Attend. Paid Ext. Bonus", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"Juego 05", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"total Handpay", width:"25%" },
            { label:"2240", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"TrueCoinIN", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"TrueCoinOUT", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
      ]

    ///TABS
    tabs.push(
      {
        label:"Contadores",
        //CONTENIDO TAB 1
        data:JSON.stringify(dataCont),
      },
      {
        label:"Billetero",
        //CONTENIDO TAB 2
        data:JSON.stringify(dataBill),
      },
      {
        label:"Pagos Manuales",
        //CONTENIDO TAB 3
        data:[],
      },
      {
        label:"Eventos",
        //CONTENIDO TAB 4
        data:[],
      },
      {
        label:"Producido",
        //CONTENIDO TAB 5
        data:JSON.stringify(dataProd),
      },
      {
        label:"Conexion",
        //CONTENIDO TAB 6
        data:JSON.stringify(dataCon),
      },
      {
        label:"EXT",
        //CONTENIDO TAB 7
        data:JSON.stringify(dataEXT),
      },
    );

    let detail = { type:"detail", sides:sides,tabs:tabs }

    let sections = [];
    sections.push(form);
    sections.push(detail);
    //sections.push(grid);

    let res = { json: { sections:sections } };
    return res;
  }

}
