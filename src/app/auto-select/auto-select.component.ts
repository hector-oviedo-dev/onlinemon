import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-auto-select',
  templateUrl: './auto-select.component.html',
  styleUrls: ['./auto-select.component.css']
})
export class AutoSelectComponent implements OnInit {

    public _ID:string;
    public _value:string;

    public _hidden:boolean;
    public _enabled:boolean;
    public _required:boolean;

    public _txt_required:string;
    public _txt_help:string;

    public _label:string;
    public _placeholder:string;

    public _options = [];

    public _valid:boolean;
    private events:EventsService;
    constructor(private services:ServicesService) {
      this.events = services.events;
    }
    public createForm() {

    }
    public getValue() {
      return {
        id:this._ID,
        value:this._value
      }
    }
    public onChange(event) {
      if (this._value) this._valid = true;
      else this._valid = false;
      let data = { id:this._ID, valid:this._valid };
      this.events.publish("onForm", JSON.stringify(data));
    }

  ngOnInit() {
  }

}
