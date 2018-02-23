import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.css']
})
export class RightSideComponent implements OnInit {

  public alarms = [];
  constructor() {
    this.alarms.push({type:'text',content:'Maquina 000005 Offline.'});
    this.alarms.push({type:'text',content:'Maquina 000007 Puerta Abierta.'});
    this.alarms.push({type:'text',content:'Maquina 000002 Offline.'});
  }

  ngOnInit() {
  }

}
