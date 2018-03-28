import { Component, ViewContainerRef, ViewChild, ComponentFactoryResolver, OnInit, Input } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-auto-grid',
  templateUrl: './auto-grid.component.html',
  styleUrls: ['./auto-grid.component.css']
})
export class AutoGridComponent implements OnInit {
  @Input() set data(value) { if (value) this.startProcess(value); };

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  public dataSource = new MatTableDataSource();
  public displayedColumns = [];
  public cols = [];

  public _label_title:string;
  public _label_submit:string;
  public _label_cancel:string;

  public _action:string;

  public _width:number;
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private services:ServicesService) {

  }
  public startProcess(data) {
    if (!data || !data.data[0]) return;

    let properties = Object.getOwnPropertyNames(data.data[0]);

    this.cols = [];
    this.displayedColumns = [];

    for (let i = 0; i < data.titles.length;i++) {
      console.log(data.titles[i])

      if (data.titles[i].ColumnaVisible == "true") {

        this.displayedColumns.push(data.titles[i].ColumnaNombre);

        let style = data.titles[i].ColumnaAlineacion;

        let width = data.titles[i].ColumnaAncho + "px";

        this.cols.push({def:data.titles[i].ColumnaNombre,label:data.titles[i].ColumnaEtiqueta,type:data.titles[i].ColumnaTipoDato, style:style, width:width});
      }
    }
    let dataS: Element[] = [];
    for (let i = 0; i < data.data.length;i++) {

      let obj = data.data[i];
      let props = Object.getOwnPropertyNames(obj);


      for (var j = 0; j < props.length; j++) {
        for (var k = 0; k < this.cols.length; k++) {
          if (this.cols[k].def == props[j] && this.cols[k].type == "DateTime") {
            let newDate = new Date(obj[props[j]]).toLocaleString();

            obj[props[j]] = newDate;
          }
        }
      }

      dataS.push(obj);
    }

     this.dataSource = new MatTableDataSource(dataS);
     this.dataSource.paginator = this.paginator;
     this.paginator._changePageSize(5);

     this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this.startProcess(this.data);
  }

}
export interface Element {
  name: string;
    position: number;
    weight: number;
    symbol: string;
}
