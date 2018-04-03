import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ServicesService } from './services.service';
import { EventsService } from 'angular4-events';
import { URLSearchParams } from "@angular/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public rightElement:boolean = true;
  public events: EventsService;

  public SPINNER = false;

  public hasAlerts = "0";

  public popupDialog:MatDialogRef<DialogPopup>;

  public privileges;
  constructor(public http: HttpClient,public services:ServicesService, public dialog: MatDialog) {
    this.events = services.events;
    this.events.subscribe("onPopup", (data) => this.onPopup(data));
    this.events.subscribe("onError", (data) => this.onError(data));
    this.events.subscribe("onSuccess", (data) => this.onSuccess(data));
    this.events.subscribe("getPrivileges", (data) => this.onGetPrivileges(data));
    this.events.subscribe("onNewAlerts", (data) => this.onAlerts(data));

    let params = new URLSearchParams(window.location.search);
    services.userID = params.get('usr_id');
    services.salaID = params.get('sala_id');

    if (!services.userID || !services.salaID) {
      this.events.publish("onError", "Error de validacion");
    } else {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');

      let url = "assets/config.json";
      //let url = "config.png";
      this.http.get(url, {headers: headers}).subscribe(res => {
        services._SERVICE_BASE = (res as any).server;
        services.AUTO_REFRESH_TIME_MINS = (res as any).timmer;

        this.services.doGet("getFirstLoad","").subscribe(
            res => { this.onServiceResult(res); },
            err => { this.events.publish("onError", "404 Server Error"); }
          );
      });
    }
  }
  public buttons:boolean = true;
  public DisableButtons() {
    this.buttons = false;
  }
  public EnableButtons() {
    this.buttons = true;
  }
  public openDateFilter() {
    let sections = [];
    let form = {
    	type:"form",
      controls:[
          {
          "id":"vista",
    		  "type":"TEXT",
    		  "value":this.services.viewmode,
    		  "hidden":true,
    		  "enabled":true,
    		  "required":true,
    		  "txt_required":"",
    		  "txt_error":"",
    		  "txt_help":"",
    		  "max":500,
    		  "min":1,
    		  "mask":"",
    		  "format":"",
    		  "restrict":[],
    		  "label":"",
    		  "placeholder":"",
    		  "display":[]
    		},
        {
          "id":"date",
          "type":"DATE",
          "value":"",
          "hidden":false,
          "enabled":true,
          "required":true,
          "txt_required":"Ingrese la fecha",
          "txt_error":"",
          "txt_help":"Ingrese la fecha",
          "max":50,
          "min":10,
          "mask":"",
          "format":"",
          "restrict":[],
          "label":"Fecha de filtro",
          "hideTime":true,
          "labelTime":"",
          "placeholder":"",
	        "placeholderTime":"",
          "display":[]
       },
    ],
    display: {
       title:"Filtro por fecha",
       action:"getMachinesSPE",
       label_submit:"Aceptar",
       label_cancel:""
     }
   };
    sections.push(form);
    let res = {success:true, json: { sections:sections}};

    this.popupDialog = this.dialog.open(DialogPopup, { data: {} });

    this.events.publish('onContent', res);
  }
  public onAlerts(data) {
    this.hasAlerts = data;
  }
  public onGetPrivileges(data) {
    this.events.publish("onPrivileges", this.privileges);
  }
  public onServiceResult(data) {
    if (!data.success) {
      this.events.publish("onError", data.message);
      return;
    }

    let res = data.json;

    this.privileges = res.privileges;

    this.events.publish("onTools", res);
    this.events.publish("onAreas", res.areas);
    this.events.publish("onMachines", res);

    this.services.getMachines();
  }
  public updateDiagrams() {
    this.events.publish("onUpdate", "");
  }
  public onPopup(data) {
      this.popupDialog = this.dialog.open(DialogPopup, { data: data });
      this.events.publish('onChange', data.service);
  }
  public onError(data) {
    this.events.publish("onPopupClose", "");
    let sections = [];
    let form = {
    	type:"form",
      controls:[
        {
         "id":"msg",
         "type":"TEXT",
         "value":data,
         "hidden":false,
         "enabled":false,
         "required":false,
         "txt_required":"",
         "txt_error":"",
         "txt_help":"",
         "max":15,
         "min":5,
         "mask":"",
         "format":"ALL",
         "restrict":[],
         "label":"",
         "placeholder":data,
         "display":[]
       },
    ],
    display: {
       title:"Error",
       action:"",
       label_submit:"Aceptar",
       label_cancel:""
     }
   };
    sections.push(form);
    let res = {success:true, json: { sections:sections}};

    this.popupDialog = this.dialog.open(DialogPopup, { data: data });

    this.events.publish('onContent', res);
  }
  public onSuccess(data) {
    this.events.publish("onPopupClose", "");

    if (!data || data == "") return;

    let sections = [];
    let form = {
      type:"form",
      controls:[
        {
         "id":"msg",
         "type":"TEXT",
         "value":data,
         "hidden":false,
         "enabled":false,
         "required":false,
         "txt_required":"",
         "txt_error":"",
         "txt_help":"",
         "max":15,
         "min":5,
         "mask":"",
         "format":"ALL",
         "restrict":[],
         "label":"",
         "placeholder":data,
         "display":[]
       },
    ],
    display: {
       title:"Respuesta",
       action:"",
       label_submit:"Aceptar",
       label_cancel:""
     }
    };
    sections.push(form);
    let res = {success:true, json: { sections:sections}};

    this.popupDialog = this.dialog.open(DialogPopup, { data: data });

    this.events.publish('onContent', res);
  }
}

@Component({
  selector: 'dialog-popup',
  templateUrl: 'dialog-popup.html',
  styleUrls: ['./app.component.css']
})
export class DialogPopup {
  private events: EventsService;
  public SPINNER = false;
  private onSpinnerEvt;
  private onPopupCloseEvt;
  constructor(public dialogRef: MatDialogRef<DialogPopup>,private services:ServicesService, @Inject(MAT_DIALOG_DATA) public data: any) {

      this.events = services.events;

      this.onSpinnerEvt = this.events.subscribe("onSpinner", (data) => this.onSpin(data));
      this.onPopupCloseEvt = this.events.subscribe("onPopupClose", (data) => this.onPopupClose(data));

      dialogRef.afterClosed().subscribe((data) => this.onClose(data,this));
  }
  public onClose(e, ref) {
    ref.onSpinnerEvt.unsubscribe();
    ref.onPopupCloseEvt.unsubscribe();
  }
  public onSpin(e) {
    if (e) this.SPINNER = true;
    else this.SPINNER = false;
  }
  public onPopupClose(e) {
    this.dialogRef.close();
  }
  public onNoClick(): void {
    this.dialogRef.close();
  }
}
