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
    let visto = true;
    for (let alert of data.alerts) {
      let alertDate = new Date(alert.FechaRecepcion);
      alertDate.setTime( alertDate.getTime() + alertDate.getTimezoneOffset()*60*1000 );

      alert.fecha = alertDate.toLocaleString();

      if (alert.Visto) alert.Color = "#F9FAFC";

      this.alerts.push(alert);

      if (!alert.Visto) visto = false;
    }
    if (!this.alerts.length) this.events.publish("onNewAlerts",0);
    else {
      if (visto) this.events.publish("onNewAlerts", 1);
      else this.events.publish("onNewAlerts", 2);
    }
  }
  public onSearch(data) {
    this.events.publish("onSearch", "UID,"+data);
  }
  public onView(IDAlerta) {
    this.services.doGet("alertUpdate","?IDAlerta="+IDAlerta).subscribe(
        res => { this.onServiceResult(res); },
        err => { this.events.publish("onError", "404 Server Error"); }
      );
  }
  public onServiceResult(data) {
    console.log(data)
    if (!data.success) {
      this.events.publish("onError", data.message);
      return;
    }
    this.services.getMachines();
  }
}
