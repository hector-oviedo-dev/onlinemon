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

  public views = [
    { label:"Por Estado", value:"state",
    },
    { label:"Por Mapa Termico" , value:"thermal",
    }
  ]
  public filters = [
    { label:"Marca", value:"brand",
      values:[{label:"IGT", value:"IGT"},{label:"WILLIAMS", value:"WILLIAMS"},{label:"BALLI", value:"BALLI"}]
    },
    { label:"Estado" , value:"state",
      values:[{label:"Online",value:"online"},{label:"Offline",value:"offline"}]
    }
  ];
  public primary:string;
  public secondary:string;

  constructor(private services:ServicesService) {
    this.events = services.events;
  }
  ngOnInit() {

  }
  public doSearch() {
    console.log("search")
    this.events.publish("onSearch", this.uid.nativeElement.value);
  }
  public doFilter() {
    this.events.publish("onFilter", "");
  }
}
