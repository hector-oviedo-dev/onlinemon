import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ServicesService } from './services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public rightElement:boolean = true;
  private events: EventsService;

  constructor(private services:ServicesService, public dialog: MatDialog) {
    this.events = services.events;
    this.events.subscribe("onPopup", (data) => this.onPopup(data));
    //this.events.subscribe("getMachines", (data) => this.onGetMachines(data));

    //this.services.connect();

    this.services.doGet("getFirstLoad","").subscribe(
        res => { this.onServiceResult(res); },
        err => {
          //let data = this.createExample();
          //console.log("MESSAGE 404 Server Address " + JSON.stringify(data));
          //this.onServiceResult(data);
        }
      );
  }
  public onServiceResult(data) {
    let res = data.json;

    this.events.publish("onTools", res);
    this.events.publish("onAreas", res.areas);
    this.events.publish("onMachines", res);

    this.services.getMachines();
  }
  public createExample() {
    let areas = [
      {label:"Planta Baja",area:"a"},
      {label:"Primer Piso",area:"b"}
    ];

    let views = [
      {label:"Estados", value:"states",},
      {label:"Mapa Termico" , value:"thermal",}
    ];

    let filters  = [
      { label:"Marcas", value:"brand",
        values:[
          {label:"IGT", value:"IGT"},
          {label:"WILLIAMS", value:"WILLIAMS"},
          {label:"BALLI", value:"BALLI"},
          {label:"AYEX", value:"AYEX"}
        ]
      },
      { label:"Estado" , value:"state",
        values:[{label:"Online",value:"online"},{label:"Offline",value:"offline"}]
      }
    ];
    let data = { areas:areas, filters:filters, views:views,maquinas:[],alerts:[] };

    return data;
  }
  public updateDiagrams() {
    this.events.publish("onUpdate", "");
  }
  public onPopup(data) {
    let dialogRef = this.dialog.open(DialogPopup, {
      width: '90%',
      height:'90%',
      data: data
    });
    this.events.publish('onChange', data.service);
  }
}

@Component({
  selector: 'dialog-popup',
  templateUrl: 'dialog-popup.html',
})
export class DialogPopup {

  constructor(
    public dialogRef: MatDialogRef<DialogPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
