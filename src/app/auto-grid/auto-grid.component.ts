import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-auto-grid',
  templateUrl: './auto-grid.component.html',
  styleUrls: ['./auto-grid.component.css']
})
export class AutoGridComponent implements OnInit {

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

    public components = [];

    public _label_title:string;
    public _label_submit:string;
    public _label_cancel:string;

    public _action:string;

    public _titles = [];
    public _rows = [];

    public _width:number;

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private services:ServicesService) {

    }
    public startProcess() {

    }
  ngOnInit() {
  }

}
