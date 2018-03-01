import { Component } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-auto-date',
  templateUrl: './auto-date.component.html',
  styleUrls: ['./auto-date.component.css']
})
export class AutoDateComponent {
  public _valid:boolean;
  public _ID:string;
  public _value:string;

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

  public _label:string = "null";
  public _placeholder:string = "";

  public _display = [];

  private events:EventsService;
  constructor(private services:ServicesService) {

      this.events = services.events;

  }
  public getValue() {
    return {
      id:this._ID,
      value:this._value
    }
  }
  public onChange(e) {
    this._valid = true;
    console.log("change")

    let data = { id:this._ID, valid:this._valid };
    this.events.publish("onForm", JSON.stringify(data));
  }
}
