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

  public views = [ ];
  public filters = [ ];
  public primary:string;
  public secondary:string;

  constructor(private services:ServicesService) {
    this.events = services.events;

    this.events.subscribe("onTools", (data) => this.onTools(data));
  }
  ngOnInit() {

  }
  public onTools(data) {
    this.views = [];
    this.filters = [];

    for (let i = 0; i < data.views.length; i++) this.views.push({label: data.views[i].entitylabel, value:data.views[i].value});

    for (let i = 0; i < data.filters.length; i++) {
      let valuesTMP = [];

      for (let j = 0; j < data.filters[i].values.length; j++) valuesTMP.push({label:data.filters[i].values[j].value,value:data.filters[i].values[j].value,propertyname:data.filters[i].values[j].propertyname,check:true})

      this.filters.push({label: data.filters[i].label, value:data.filters[i].value, values:valuesTMP});
    }
  }
  public doSearch() {
    console.log("search");
    this.events.publish("onSearch", this.uid.nativeElement.value);
  }
  public doFilter(data) {
    if (data.check) data.check = false;
    else data.check = true;
    this.events.publish("onFilter", this.filters);
  }
}
