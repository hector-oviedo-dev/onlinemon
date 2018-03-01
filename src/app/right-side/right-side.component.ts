import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.css']
})
export class RightSideComponent implements OnInit {
  private events: EventsService;

  public alerts = [];
  constructor(private services:ServicesService) {
    this.events = services.events;

    this.events.subscribe("onMachines", (data) => this.onAlerts(data));
  }

  ngOnInit() {
  }
  public onAlerts(data) {
    if (!data.alerts) return;

    this.alerts = [];
    for (let alert of data.alerts) this.alerts.push({type:(alert as any).type,label:(alert as any).label});
  }
}
