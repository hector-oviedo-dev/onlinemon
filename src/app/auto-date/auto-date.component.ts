import { Component, ViewChild } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-auto-date',
  templateUrl: './auto-date.component.html',
  styleUrls: ['./auto-date.component.css']
})
export class AutoDateComponent {
  @ViewChild('timePicker') timePicker;

  public config = {
    hours24Format: 'HH',
    minutesFormat: 'mm',
    showTwentyFourHours: true,
  };

  public _valid:boolean;
  public _ID:string;
  public _value:any;
  public _valueDate:any;
  public _valueTime:any;

  public _hideTime:boolean = false;

  public _hidden:boolean;
  public _enabled:boolean;
  public _required:boolean;

  public _txt_required:string;
  public _txt_error:string;
  public _txt_help:string;

  public _min:number = 0;
  public _max:number = 50;

  public _mask:string;
  public _format:string;

  public _restrict = [];

  public _label:string = "";
  public _labelTime:string = "";
  public _placeholder:string = "";
  public _placeholderTime:string = "";

  public _display = [];

  private events:EventsService;

  public date;
  public dateTime;
  constructor(private services:ServicesService) {
      this.events = services.events;

      //this.timePicker.api.close();
  }
  public getValue() {
    return {
      id:this._ID,
      value:this._value
    }
  }
  public onChange(e) {
    this.date = new Date(this._valueDate);

    if (!this._hideTime) this.dateTime = new Date(this._valueTime);
    else this.dateTime = new Date(this._valueDate);

    if (isNaN(this.date.getTime()) || isNaN(this.dateTime.getTime())) console.log("invalid");
    else {
      this.date.setHours(this.dateTime.getHours());
      this.date.setMinutes(this.dateTime.getMinutes());

      var options = { hour12: false, hour: '2-digit', minute:'2-digit' };


      this._placeholder = this.date.toLocaleDateString();
      this._placeholderTime = this.dateTime.toLocaleTimeString('en-US', options);

      this._valid = true;
      this._value = this.date;
    }


    let data = { id:this._ID, valid:this._valid };
    this.events.publish("onForm", JSON.stringify(data));
  }
}
