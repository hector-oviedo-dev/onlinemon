import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, OnInit, AfterViewInit } from '@angular/core';
import { AutoFormComponent } from '../auto-form/auto-form.component';
import { AutoGridComponent } from '../auto-grid/auto-grid.component';
import { ServicesService } from '../services.service';
import { ErrorComponent } from '../error/error.component';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  public components = [];

  public menus = [];

  public service:string;

  private events:EventsService;

  private refresh:boolean = false;
  private content;
  constructor(private componentFactoryResolver: ComponentFactoryResolver,private services:ServicesService) {
    this.events = services.events;
    this.events.subscribe('onChange', (content) => { this.onChange(content); });

    //this.content = this.navParams.get('content');
    //this.refresh = this.navParams.get('refresh');

  }
  public ngAfterViewInit() {
    //this.doStart();
  }
  public onChange(content) {
    this.service = content;
    this.container.clear();
    this.doStart();
  }
  public onServiceResult(data) {
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
          }
        } else {
          let data = { "MESSAGE":"Se esperaba en posicion" + i.toString() +" de 'sections' el objeto 'type'" }
          //this.navCtrl.push(ErrorPage, data);
        }
      }
    } else {
      let data = { "MESSAGE":"Se esperaba array 'sections'" }
      //this.navCtrl.push(ErrorPage, data);
    }
  }
  public doStart() {
    if (!this.services.hardcoded) {
      this.services.doGet(this.service,"").subscribe(
        data => { this.onServiceResult(data); },
        err => {
          let data = { "MESSAGE":"404 Server Address" }
          //this.navCtrl.push(ErrorPage, data);
        }
      );
    } else {
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
        },/*
        {
          "id":"PAIS_PROVINCIA",
          "type":"DUOSELECT",
          "hidden":false,
          "enabled":true,
          "required":false,
          "txt_required":"Este campo es obligatorio",
          "txt_help":"Seleccione un pais, y luego una de las provincias",
          "label":"Seleccionar Pais",
          "values":[
            {
              "label":"Argentina",
              "value":"argentina",
              "values":[{label:"formosa",value:"formosa","check":false},{label:"Chaco",value:"chaco","check":false}],
              "check":false
            },
            {
              "label":"Chile",
              "value":"chile",
              "values":[{label:"Santiago de Chile",value:"santiago","check":false},{label:"Valparaiso",value:"valparaiso","check":false}],
              "check":false
            },
            {
              "label":"Japon",
              "value":"japon",
              "values":[{label:"Tokio",value:"tokio","check":false},{label:"Seoul",value:"seoul","check":false}],
              "check":false
            }
          ]
        }*/
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

      let sections = [];
      sections.push(form);
      //sections.push(grid);

      let res = { json: { sections:sections}};



      this.onServiceResult(res);
    }
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


    /*
    (<AutoGridComponent>component.instance)._action       = data.display.action;

    (<AutoGridComponent>component.instance)._label_title  = data.display.title;
    (<AutoGridComponent>component.instance)._label_submit = data.display.label_submit;
    (<AutoGridComponent>component.instance)._label_cancel = data.display.label_cancel;
    */

    for (let i = 0; i < data.titles.length; i++) {
      let option = {
        label:data.titles[i].label
      };

      (<AutoGridComponent>component.instance)._titles.push(option);
    }

    for (let i = 0; i < data.rows.length; i++) {

      let row = { cols: [] };
      for (let j = 0; j < data.rows[i].cols.length; j++)
        {
          let col = {
            type:data.rows[i].cols[j].type,
            label:data.rows[i].cols[j].label
          };
          row.cols.push(col);
        }
      (<AutoGridComponent>component.instance)._rows.push(row);
    }

    (<AutoGridComponent>component.instance).startProcess();

    this.components.push(component);
  }

  ngOnInit() {
    this.doStart();
  }

}
