import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  public SPINNER = false;

  public popupDialog:MatDialogRef<DialogPopup>;

  public privileges;
  constructor(public http: HttpClient,private services:ServicesService, public dialog: MatDialog) {
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');

      let url = "/assets/config.json";
      this.http.get(url, {headers: headers}).subscribe(res => {
        services._SERVICE_BASE = (res as any).server;

        this.events = services.events;
        this.events.subscribe("onPopup", (data) => this.onPopup(data));
        this.events.subscribe("getPrivileges", (data) => this.onGetPrivileges(data));

        //this.services.connect();

        this.services.doGet("getFirstLoad","").subscribe(
            res => { this.onServiceResult(res); },
            err => {
              //let data = this.createExample();
              //console.log("MESSAGE 404 Server Address " + JSON.stringify(data));
              //this.onServiceResult(data);
            }
          );
      });
  }
  public onGetPrivileges(data) {
    this.events.publish("onPrivileges", this.privileges);
  }
  public onServiceResult(data) {
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
    console.log("SPINNER:" + e);
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
