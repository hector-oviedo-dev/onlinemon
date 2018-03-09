import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, OnInit } from '@angular/core';
import { AutoInputComponent } from '../auto-input/auto-input.component';
import { AutoTextareaComponent } from '../auto-textarea/auto-textarea.component';
import { AutoDateComponent } from '../auto-date/auto-date.component';
import { AutoCheckComponent } from '../auto-check/auto-check.component';
import { AutoChecklistComponent } from '../auto-checklist/auto-checklist.component';
import { AutoRadioComponent } from '../auto-radio/auto-radio.component';
import { AutoSelectComponent } from '../auto-select/auto-select.component';

import { ErrorComponent } from '../error/error.component';

import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-auto-form',
  templateUrl: './auto-form.component.html',
  styleUrls: ['./auto-form.component.css']
})
export class AutoFormComponent implements OnInit {
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  public components = [];

  public values = [];
  public _label_title:string;
  public _label_submit:string;
  public _label_cancel:string;

  public _action:string;

  public _valid:boolean = false;

  public _controls = [];

  private events:EventsService;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private services:ServicesService) {
    this.events = this.services.events;
    this.events.subscribe('onForm', (obj) => { this.onForm(obj); });
  }
  //this.events.unsubscribe('onForm');
  public onForm(objSTR) {
    let obj = JSON.parse(objSTR);
    this._valid = true;
    for (let i = 0; i < this._controls.length;i++) {
      if (this._controls[i].id == obj.id) this._controls[i].valid = obj.valid;
      if (!this._controls[i].valid) this._valid = false;

      console.log("id " + this._controls[i].id  + "valid " + this._controls[i].valid)
    }

  }
  public submitClick() {
    this.events.publish("onSpinner", true);

    let data = [];
    for (var i = 0; i < this.components.length; i++) data.push(this.components[i].instance.getValue());

    this.services.doPost(this._action,data).subscribe(
      data => { this.onServiceResult(data); },
      err => {
        let data = { "MESSAGE":"404 Server Address" }
        //this.navCtrl.push(ErrorPage, data);
        console.log(data);
      }
    );

  }
  public onServiceResult(result) {
    this.events.publish("onSpinner", false);
    this.events.publish("onPopupClose", null);
    this.services.getMachines();
    /*
    if (result.success == true) console.log("Success");
    else {
      let data = { "MESSAGE":result.error }
      //this.navCtrl.push(ErrorPage, data);
      console.log(data);
    }*/
  }
  public cancelClick() {

  }
  public startProcess() {
    for (var i = 0; i < this.values.length; i++)
    {
      let control = { id:this.values[i].id , valid:false };

      let arr = [];
      let result;

      let arrs;
      let resultARR;

      switch (this.values[i].type) {
        case "TEXT":

          arr = ["id","value","hidden","enabled","required","txt_required","txt_error","txt_help","min","max","mask","format","label","placeholder"];
          result = (this.validateComponent(this.values[i],arr));
          if (!result.valid) {
            let data = { "MESSAGE":"MalFormed: Missing at object of type: " + this.values[i].type + " objects: " + result.missing }
            //this.navCtrl.push(ErrorPage, data);
            console.log(data);
            return;
          } else this.addInput(this.values[i]);

          break;
        case "TEXTAREA":

          arr = ["id","value","hidden","enabled","required","txt_required","txt_error","txt_help","min","max","mask","format","label","placeholder"];
          result = (this.validateComponent(this.values[i],arr));
          if (!result.valid) {
            let data = { "MESSAGE":"MalFormed: Missing at object of type: " + this.values[i].type + " objects: " + result.missing }
            //this.navCtrl.push(ErrorPage, data);
            console.log(data);
            return;
          } else this.addInput(this.values[i]);

          break;
        case "CHECKBOX":

          control.valid = true;

          arr = ["id","value","hidden","enabled","required","txt_help","label"];
          result = (this.validateComponent(this.values[i],arr));
          if (!result.valid) {
            let data = { "MESSAGE":"MalFormed: Missing at object of type: " + this.values[i].type + " objects: " + result.missing }
            //this.navCtrl.push(ErrorPage, data);
            console.log(data);
            return;
          } else this.addCheckbox(this.values[i]);

          break;
        case "CHECKBOXLIST":

          arr = ["id","hidden","enabled","required","txt_required","txt_help","min","max","label","servicio"];
          result = (this.validateComponent(this.values[i],arr));

          if (!result.valid) {
            let data = { "MESSAGE":"MalFormed: Missing at object of type: " + this.values[i].type + " objects: " + result.missing }
            //this.navCtrl.push(ErrorPage, data);
            console.log(data);
            return;
          } else this.addCheckboxlist(this.values[i]);

          break;
        case "RADIO":
          arr = ["id","hidden","enabled","required","txt_required","txt_help","label","values"];
          result = (this.validateComponent(this.values[i],arr));

          if (!result.valid) {
            let data = { "MESSAGE":"MalFormed: Missing at object of type: " + this.values[i].type + " objects: " + result.missing }
            //this.navCtrl.push(ErrorPage, data);
            console.log(data);
            return;
          } else this.addRadio(this.values[i]);

          break;
        case "SELECT":
          arr = ["id","hidden","enabled","required","txt_required","txt_help","label","values"];
          result = (this.validateComponent(this.values[i],arr));

          if (!result.valid) {
            let data = { "MESSAGE":"MalFormed: Missing at object of type: " + this.values[i].type + " objects: " + result.missing }
            //this.navCtrl.push(ErrorPage, data);
            console.log(data);
            return;
          } else this.addSelect(this.values[i]);

          break;
          case "DATE":
            arr = ["id","hidden","enabled","required","txt_required","txt_help","label"];
            result = (this.validateComponent(this.values[i],arr));

            if (!result.valid) {
              let data = { "MESSAGE":"MalFormed: Missing at object of type: " + this.values[i].type + " objects: " + result.missing }
              //this.navCtrl.push(ErrorPage, data);
              console.log(data);
              return;
            } else this.addDate(this.values[i]);

            break;/*
          case "DUOSELECT":
            arr = ["id","hidden","enabled","required","txt_required","txt_help","label","values"];
            result = (this.validateComponent(this.values[i],arr));

            if (!result.valid) {
              let data = { "MESSAGE":"MalFormed: Missing at object of type: " + this.values[i].type + " objects: " + result.missing }
              //this.navCtrl.push(ErrorPage, data);
              return;
            } else this.addDuoSelect(this.values[i]);

            break;*/
      }
      if (this.values[i].hidden) control.valid = true;
      this._controls.push(control);
    }
  }
  public validateComponent(obj, arr) {
    let result = {valid:true, missing:[] }
    for (let i = 0; i < arr.length; i++) if (!obj.hasOwnProperty(arr[i])) result.missing.push(arr[i]);

    if (result.missing.length) result.valid = false;

    return result;
  }
  public addInput(value:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoInputComponent);
    const component = this.container.createComponent(componentFactory);

    (<AutoInputComponent>component.instance)._ID          = value.id;
    (<AutoInputComponent>component.instance)._value       = value.value;

    (<AutoInputComponent>component.instance)._hidden      = value.hidden;
    (<AutoInputComponent>component.instance)._enabled     = value.enabled;
    (<AutoInputComponent>component.instance)._required    = value.required;

    (<AutoInputComponent>component.instance)._txt_required= value.txt_required;
    (<AutoInputComponent>component.instance)._txt_error   = value.txt_error;
    (<AutoInputComponent>component.instance)._txt_help    = value.txt_help;

    (<AutoInputComponent>component.instance)._min         = value.min;
    (<AutoInputComponent>component.instance)._max         = value.max;

    (<AutoInputComponent>component.instance)._mask        = value.mask;
    (<AutoInputComponent>component.instance)._format      = value.format;

    //for (let i = 0; i < value.restrict.length; i++) (<AutoInputComponent>component.instance)._restrict.push(value.restrict[i]);

    (<AutoInputComponent>component.instance)._label       = value.label;
    (<AutoInputComponent>component.instance)._placeholder = value.placeholder;

    (<AutoInputComponent>component.instance).createForm();

    // Push the component so that we can keep track of which components are created
    this.components.push(component);
    return true;
  }
  public addTextarea(value:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoTextareaComponent);
    const component = this.container.createComponent(componentFactory);

    (<AutoTextareaComponent>component.instance)._ID          = value.id;
    (<AutoTextareaComponent>component.instance)._value       = value.value;

    (<AutoTextareaComponent>component.instance)._hidden      = value.hidden;
    (<AutoTextareaComponent>component.instance)._enabled     = value.enabled;
    (<AutoTextareaComponent>component.instance)._required    = value.required;

    (<AutoTextareaComponent>component.instance)._txt_required= value.txt_required;
    (<AutoTextareaComponent>component.instance)._txt_error   = value.txt_error;
    (<AutoTextareaComponent>component.instance)._txt_help    = value.txt_help;

    (<AutoTextareaComponent>component.instance)._min         = value.min;
    (<AutoTextareaComponent>component.instance)._max         = value.max;

    (<AutoTextareaComponent>component.instance)._mask        = value.mask;
    (<AutoTextareaComponent>component.instance)._format      = value.format;

    //for (let i = 0; i < value.restrict.length; i++) (<AutoTextareaComponent>component.instance)._restrict.push(value.restrict[i]);

    (<AutoTextareaComponent>component.instance)._label       = value.label;
    (<AutoTextareaComponent>component.instance)._placeholder = value.placeholder;

    (<AutoTextareaComponent>component.instance).createForm();

    // Push the component so that we can keep track of which components are created
    this.components.push(component);
    return true;
  }
  public addDate(value:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoDateComponent);
    const component = this.container.createComponent(componentFactory);

    (<AutoDateComponent>component.instance)._ID          = value.id;
    (<AutoDateComponent>component.instance)._value       = value.value;

    (<AutoDateComponent>component.instance)._hidden      = value.hidden;
    (<AutoDateComponent>component.instance)._enabled     = value.enabled;
    (<AutoDateComponent>component.instance)._required    = value.required;

    (<AutoDateComponent>component.instance)._txt_required= value.txt_required;
    (<AutoDateComponent>component.instance)._txt_error   = value.txt_error;
    (<AutoDateComponent>component.instance)._txt_help    = value.txt_help;

    (<AutoDateComponent>component.instance)._mask        = value.mask;
    (<AutoDateComponent>component.instance)._format      = value.format;

    for (let i = 0; i < value.restrict.length; i++) (<AutoDateComponent>component.instance)._restrict.push(value.restrict[i]);

    (<AutoDateComponent>component.instance)._label       = value.label;
    (<AutoDateComponent>component.instance)._placeholder = value.placeholder;

    //(<AutoDateComponent>component.instance).createForm();

    // Push the component so that we can keep track of which components are created
    this.components.push(component);
    return true;
  }
  public addCheckbox(value:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoCheckComponent);
    const component = this.container.createComponent(componentFactory);

    (<AutoCheckComponent>component.instance)._ID          = value.id;
    (<AutoCheckComponent>component.instance)._value       = value.value;

    (<AutoCheckComponent>component.instance)._hidden      = value.hidden;
    (<AutoCheckComponent>component.instance)._enabled     = value.enabled;
    (<AutoCheckComponent>component.instance)._required    = value.required;

    (<AutoCheckComponent>component.instance)._txt_help    = value.txt_help;

    (<AutoCheckComponent>component.instance)._label       = value.label;

    // Push the component so that we can keep track of which components are created
    this.components.push(component);
    return true;
  }
  public addCheckboxlist(value:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoChecklistComponent);
    const component = this.container.createComponent(componentFactory);

    (<AutoChecklistComponent>component.instance)._ID          = value.id;

    (<AutoChecklistComponent>component.instance)._hidden      = value.hidden;
    (<AutoChecklistComponent>component.instance)._enabled     = value.enabled;
    (<AutoChecklistComponent>component.instance)._required    = false;

    (<AutoChecklistComponent>component.instance)._txt_required= value.txt_required;
    (<AutoChecklistComponent>component.instance)._txt_help    = value.txt_help;

    (<AutoChecklistComponent>component.instance)._min         = value.min;
    (<AutoChecklistComponent>component.instance)._max         = value.max;

    (<AutoChecklistComponent>component.instance)._label       = value.label;

    console.log("el texto es:" + value.label)

    for (let i = 0; i < value.values.length; i++) {
      let option = {
        label:value.values[i].label,
        value:value.values[i].value,
        check:value.values[i].check
      };

      (<AutoChecklistComponent>component.instance)._options.push(option);
    }

    //(<AutoChecklistComponent>component.instance).createForm();

    // Push the component so that we can keep track of which components are created
    this.components.push(component);

    this.services.doGet(value.servicio,"",true).subscribe(res => { this.loadChcekboxlist(res,component); });

    return true;
  }
  public loadChcekboxlist(data, component) {
    let values = data.json

    for (let i = 0; i < values.length; i++) {
      console.log(values[i])
      let option = {
        label:values[i].descripcion,
        value:values[i].id,
        check:false
      };

      (<AutoChecklistComponent>component.instance)._options.push(option);
    }
    (<AutoChecklistComponent>component.instance).createForm();

  }
  public addRadio(value:any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoRadioComponent);
    const component = this.container.createComponent(componentFactory);

    (<AutoRadioComponent>component.instance)._ID          = value.id;

    (<AutoRadioComponent>component.instance)._hidden      = value.hidden;
    (<AutoRadioComponent>component.instance)._enabled     = value.enabled;
    (<AutoRadioComponent>component.instance)._required    = value.required;

    (<AutoRadioComponent>component.instance)._txt_required= value.txt_required;
    (<AutoRadioComponent>component.instance)._txt_help    = value.txt_help;

    (<AutoRadioComponent>component.instance)._label       = value.label;

    for (let i = 0; i < value.values.length; i++) {
      let option = {
        label:value.values[i].label,
        value:value.values[i].value,
        check:value.values[i].check
      };

      (<AutoRadioComponent>component.instance)._options.push(option);
    }

    (<AutoRadioComponent>component.instance).createForm();

    // Push the component so that we can keep track of which components are created
    this.components.push(component);
    return true;
  }
  public addSelect(value:any) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoSelectComponent);
    const component = this.container.createComponent(componentFactory);

    (<AutoSelectComponent>component.instance)._ID          = value.id;
    (<AutoSelectComponent>component.instance)._value       = value.value;

    (<AutoSelectComponent>component.instance)._hidden      = value.hidden;
    (<AutoSelectComponent>component.instance)._enabled     = value.enabled;
    (<AutoSelectComponent>component.instance)._required    = value.required;

    (<AutoSelectComponent>component.instance)._txt_required= value.txt_required;
    (<AutoSelectComponent>component.instance)._txt_help    = value.txt_help;

    (<AutoSelectComponent>component.instance)._label       = value.label;

    for (let i = 0; i < value.values.length; i++) {
      let option = {
        label:value.values[i].label,
        value:value.values[i].value
      };
      if (value.values[i].check) (<AutoSelectComponent>component.instance)._value = value.values[i].value;

      (<AutoSelectComponent>component.instance)._options.push(option);
    }

    // Push the component so that we can keep track of which components are created
    this.components.push(component);
    return true;
  }/*
  public addDuoSelect(value:any) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AutoDuoselectComponent);
    const component = this.container.createComponent(componentFactory);

    (<AutoDuoselectComponent>component.instance)._ID          = value.id;
    (<AutoDuoselectComponent>component.instance)._value       = value.value;

    (<AutoDuoselectComponent>component.instance)._hidden      = value.hidden;
    (<AutoDuoselectComponent>component.instance)._enabled     = value.enabled;
    (<AutoDuoselectComponent>component.instance)._required    = value.required;

    (<AutoDuoselectComponent>component.instance)._txt_required= value.txt_required;
    (<AutoDuoselectComponent>component.instance)._txt_help    = value.txt_help;

    (<AutoDuoselectComponent>component.instance)._label       = value.label;

    for (let i = 0; i < value.values.length; i++) {
      let option = {
        label:value.values[i].label,
        value:value.values[i].value,
        values:[]
      };
      for (let j = 0; j < value.values[i].values.length; j++) option.values.push(value.values[i].values[j])

      if (value.values[i].check) (<AutoDuoselectComponent>component.instance)._value = value.values[i].value;

      (<AutoDuoselectComponent>component.instance)._options.push(option);
    }

    // Push the component so that we can keep track of which components are created
    this.components.push(component);
    return true;
  }*/
  ngOnInit() {
  }

}
