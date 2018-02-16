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

      this.areas.push({label:"Piso A",area:"a"});
      this.areas.push({label:"Piso B",area:"b"});
      this.areas.push({label:"Piso C",area:"c"});
      this.areas.push({label:"Piso D",area:"d"});
      this.areas.push({label:"Piso E",area:"e"});
  }
  @Input()
    set ready(isReady: boolean) {
      if (isReady) console.log("endup");
      else console.log("oke");
    }
  ngOnInit() {

  }
  public onFocusChange(e) {
    console.log("haschanged: " + this.areas[e.index].label)
    //this.diagrams._results[e.index].doStart();
  }
}
