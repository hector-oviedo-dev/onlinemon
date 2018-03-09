import { Component, OnInit, ViewChildren, QueryList, Input } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';
import { DiagramComponent } from '../diagram/diagram.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  private events: EventsService;

  public areas = [];

  @ViewChildren('diagrams') diagrams:QueryList<DiagramComponent>;

  constructor(private services:ServicesService) {
      this.events = services.events;

      this.events.subscribe("onAreas", (data) => this.onAreas(data));
  }
  @Input()
    set ready(isReady: boolean) {
      if (isReady) console.log("endup");
      else console.log("oke");
    }
  ngOnInit() {

  }
  public onAreas(data) {
    this.areas = [];

    for (var i = 0; i < data.length; i++) this.areas.push({label:data[i].entitylabel,area:data[i].propertyvalue});
  }
  public onFocusChange(e) {
    //console.log("haschanged: " + this.areas[e.index].label)
    this.services.events.publish("onUpdate",this.areas[e.index].label);

  }
}
