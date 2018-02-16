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

    this.services.connect();
  }
  public onPopup(data) {
      console.log(data)
      let dialogRef = this.dialog.open(DialogPopup, {
      width: '700px',
      data: data.data
    });
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
