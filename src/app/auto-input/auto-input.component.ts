import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule  } from '@angular/forms';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-auto-input',
  templateUrl: './auto-input.component.html',
  styleUrls: ['./auto-input.component.css']
})
export class AutoInputComponent implements OnInit {

  public _ID:string;
  public _value:string;

  public _hidden:boolean;
  public _enabled:boolean;
  public _required:boolean;

  public _txt_required:string;
  public _txt_error:string;
  public _txt_help:string;

  public _min:number;
  public _max:number;

  public _mask:string;
  public _format:string;

  public _restrict = [];

  public _label:string;
  public _placeholder:string;

  public _display = [];

  public _form:FormGroup;

  private events:EventsService;
  constructor(private _fb:FormBuilder, private services:ServicesService) {

      this.events = services.events;
  }
  public createForm() {
    this._form = this._fb.group({data:[""]});

    if (this._hidden) return;

    let validators = [];
    if (this._required) validators.push(Validators.required);
    if (this._required) validators.push(Validators.minLength(this._min));
    if (this._required) validators.push(Validators.maxLength(this._max));
    this._form.controls["data"].setValidators(validators);

    if (!this._enabled) this._form.controls["data"].disable();
  }
  public getValue() {
    return {
      id:this._ID,
      value:this._value
    }
  }
  public onChange(event) {
    console.log(this._value)
    //this._value = event

    let data = { id:this._ID, valid:this._form.controls['data'].valid };
    this.events.publish("onForm", JSON.stringify(data));
  }
  ngOnInit() {
  }

}
