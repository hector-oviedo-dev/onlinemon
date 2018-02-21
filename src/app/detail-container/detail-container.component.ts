import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detail-container',
  templateUrl: './detail-container.component.html',
  styleUrls: ['./detail-container.component.css']
})
export class DetailContainerComponent implements OnInit {
  @Input()
  public data:string = "";
  public rows = [];
  constructor() {
    //this.rows = JSON.parse(this.data);
  }

  ngOnInit() {
    this.rows = JSON.parse(this.data);
  }

}