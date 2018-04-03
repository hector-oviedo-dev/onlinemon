import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.css']
})
export class LeftSideComponent implements OnInit {
  private events: EventsService;

  @ViewChild("uid")
  private uid:ElementRef;

  @ViewChild("grid")
  private grid:ElementRef;

  public menuLabels:any = { lock:{label:""},views:{label:""},filters:{label:""},search:{label:""} };

  public views = [ ];
  public filters = [ ];
  public search = [ ];
  public info;
  public primary:string;
  public secondary:string;

  public blocked:boolean = true;

  public hasblocking:boolean = true;

  public _buscarID:string;
  constructor(private services:ServicesService) {
    this.events = services.events;

    this.events.subscribe("onTools", (data) => this.onTools(data));
    this.events.subscribe("onInfo", (data) => this.onInfo(data));
  }
  ngOnInit() {

  }
  public onInfo(data) {
    this.info = data.info;
  }
  public onTools(data) {
    this.views = [];
    this.filters = [];
    this.search = [];
    this.info = data.info;

    this.menuLabels = data.menutranslation;

    for (let i = 0; i < data.views.length; i++) this.views.push({label: data.views[i].propertylabel, value:data.views[i].propertyvalue});

    for (let i = 0; i < data.filters.length; i++) {
      let valuesTMP = [];

      for (let j = 0; j < data.filters[i].values.length; j++) valuesTMP.push({label:data.filters[i].values[j].propertylabel,value:data.filters[i].values[j].propertyvalue,propertyname:data.filters[i].values[j].propertyname,check:true})

      this.filters.push({label: data.filters[i].label, value:data.filters[i].value, values:valuesTMP});
    }

    for (let i = 0; i < data.search.length; i++) {
      //let valuesTMP = [];

      //for (let j = 0; j < data.search[i].values.length; j++) valuesTMP.push({label:data.search[i].values[j].propertylabel,value:data.search[i].values[j].propertyvalue,propertyname:data.search[i].values[j].propertyname,check:true})
      this.search.push(data.search[i]);
    }

    if (data.search.length) this._buscarID = data.search[0].entitylabel;

    if (data.privileges.position) this.hasblocking = true;
    else this.hasblocking = false;
  }
  public hasBlocking() {
    return this.hasblocking;
  }
  public doView(data) {
    this.events.publish("onView", data.value);
  }
  public doSearch() {
    console.log("search");
    this.events.publish("onSearch", this._buscarID+","+this.uid.nativeElement.value);
  }
  public doFilter(data) {
    if (data.check) data.check = false;
    else data.check = true;
    this.events.publish("onFilter", this.filters);
  }
  public doBlock(e) {
    if (this.blocked) this.blocked = false;
    else this.blocked = true;

    this.services.isEditing = !this.blocked;
    this.events.publish("onBlock", !this.blocked);
  }
}
