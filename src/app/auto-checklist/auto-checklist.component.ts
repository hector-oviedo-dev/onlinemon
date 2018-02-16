import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-auto-checklist',
  templateUrl: './auto-checklist.component.html',
  styleUrls: ['./auto-checklist.component.css']
})
export class AutoChecklistComponent implements OnInit {
  public _ID:string;

  public _hidden:boolean;
  public _enabled:boolean;
  public _required:boolean;

  public _txt_required:string;
  public _txt_help:string;

  public _min:number;
  public _max:number;

  public _label:string;

  public _options = [];

  public _valid:boolean;

  private events:EventsService;
  constructor(private services:ServicesService) {
    this.events = services.events;
  }

  ngOnInit() {
  }
  public createForm() {
      let tmp = 0;
      for (let i = 0; i < this._options.length; i++) if (this._options[i].check) tmp++;

      if (tmp >= this._min && tmp <= this._max) this._valid = true;
      else this._valid = false;
    }
    public getValue() {
      return {
        id:this._ID,
        value:this._options
      }
    }
    public onChange(i) {

        if (this._options[i].check) this._options[i].check = false;
        else this._options[i].check = true;

        let tmp = 0;
        for (let i = 0; i < this._options.length; i++) if (this._options[i].check) tmp++;

        if (tmp >= this._min && tmp <= this._max) this._valid = true;
        else this._valid = false;

        let data = { id:this._ID, valid:this._valid };
        this.events.publish("onForm", JSON.stringify(data));
    }
}
