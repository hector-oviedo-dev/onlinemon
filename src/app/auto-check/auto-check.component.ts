import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auto-check',
  templateUrl: './auto-check.component.html',
  styleUrls: ['./auto-check.component.css']
})
export class AutoCheckComponent implements OnInit {

    public _ID:string;
    public _value:string;

    public _hidden:boolean;
    public _enabled:boolean;
    public _required:boolean;

    public _txt_help:string;

    public _label:boolean;
  constructor() { }

  ngOnInit() {
  }
  public getValue() {
    return {
      id:this._ID,
      value:this._value
    }
  }
}
