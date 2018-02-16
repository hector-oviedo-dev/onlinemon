import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-auto-radio',
  templateUrl: './auto-radio.component.html',
  styleUrls: ['./auto-radio.component.css']
})
export class AutoRadioComponent implements OnInit {


    public _ID:string;

    public _hidden:boolean;
    public _enabled:boolean;
    public _required:boolean;

    public _txt_required:string;
    public _txt_help:string;

    public _label:string;

    public _options = [];

    public _valid:boolean;

    private events:EventsService;
    constructor(private services:ServicesService) {
      this.events = services.events;
    }
    public createForm() {
      this._valid = false;
      for (let i = 0; i < this._options.length; i++) if (this._options[i].check) this._valid = true;
    }
    public getValue() {
      return {
        id:this._ID,
        value:this._options
      }
    }
    public onChange(i) {
      for (let j = 0; j < this._options.length; j++) this._options[j].check = false;
      this._options[i].check = true;

      this._valid = false;
      for (let i = 0; i < this._options.length; i++) if (this._options[i].check) this._valid = true;

      let data = { id:this._ID, valid:this._valid };
      this.events.publish("onForm", JSON.stringify(data));
    }
  ngOnInit() {
  }

}
