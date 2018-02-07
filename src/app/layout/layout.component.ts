import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { EventsService } from 'angular4-events';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  private events: EventsService;

  public areas = [];

  constructor(private services:ServicesService) {
      this.events = services.events;

      this.areas.push({label:"Piso A",area:"a"});
      this.areas.push({label:"Piso B",area:"b"});
  }

  ngOnInit() {
  }

}
