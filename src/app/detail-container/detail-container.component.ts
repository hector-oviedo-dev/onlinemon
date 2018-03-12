import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-detail-container',
  templateUrl: './detail-container.component.html',
  styleUrls: ['./detail-container.component.css']
})
export class DetailContainerComponent implements OnInit {
  @Input() set data(value) { this.rows = value; };

  @Input()
  public datatype:string = "";

  public rows;
  constructor() {

  }

  ngOnInit() {

  }
}
