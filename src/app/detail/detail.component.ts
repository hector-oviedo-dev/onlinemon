import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  public data:any;

  public sides = [];
  public details = [];
  constructor(private services:ServicesService) {

  }
  private onServiceResult(data) {
    let res = data.json;

    this.sides = res.info;
    this.details = res.tabs;
  }
  public onFocusChange(e) {
    if (this.details[e.index].type == "grid") console.log("try")
  }
  ngOnInit() {

  }
}
