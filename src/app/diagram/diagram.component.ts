import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ServicesService } from '../services.service';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {
  private diagram: go.Diagram = new go.Diagram();

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  constructor(private services:ServicesService) {

    services.connect();

    const $ = go.GraphObject.make;
      this.diagram = new go.Diagram();
      this.diagram.initialContentAlignment = go.Spot.Center;
      this.diagram.allowDrop = true;
      this.diagram.undoManager.isEnabled = true;
      this.diagram.toolManager.hoverDelay = 100;

      /*
      this.diagram.addDiagramListener("ChangedSelection",
          e => {
            const node = e.diagram.selection.first();
            this.nodeSelected.emit(node instanceof go.Node ? node : null);
          });
      this.diagram.addModelChangedListener(e => e.isTransactionFinished && this.modelChanged.emit(e));
      */
      this.diagram.nodeTemplate =
      $(go.Node,
        new go.Binding("location", "loc"),
        { locationSpot: go.Spot.Center },

        $(go.Shape, "Square",
          new go.Binding("fill", "color"),
          new go.Binding("width", "width"),
          new go.Binding("angle", "angle"),
          ),  // also specified by data
          $(go.TextBlock,
            { margin: 8, wrap: go.TextBlock.WrapFit, textAlign: "center" },  // some room around the text
            // TextBlock.text is bound to Node.data.key
            new go.Binding("text", "uid"),
            new go.Binding("angle", "angle")
          ),
        { // this tooltip shows the name and picture of the kitten
          toolTip:
            $(go.Adornment, "Auto",
              $(go.Shape, { fill: "lightyellow" }),
              $(go.Panel, "Vertical",
                $(go.TextBlock, { margin: 3 },
                  new go.Binding("text", "uid")),
                $(go.TextBlock, { margin: 3 },
                  new go.Binding("text", "estado"))
              )
            )  // end Adornment
        }
      );

      // initialize contents of Palette
      this.diagram.model.nodeDataArray =
        [
          { uid:"4453", estado: "Estado: Offline", src: "50x40", loc: new go.Point(220, 130), color: "red", angle:32, width:50 },
          { uid:"442353", estado: "Estado: Online", src: "55x55", loc: new go.Point(420, 250), color: "green", angle:0, width:50 },
          { uid:"1232143", estado: "Estado: Puerta Abierta", src: "60x90", loc: new go.Point(640, 450), color: "yellow", angle:0, width:50 }
        ];
        //background image
        this.diagram.add(
        $(go.Part,  // this Part is not bound to any model data
          { layerName: "Background", position: new go.Point(0, 0),
            selectable: false, pickable: false },
          $(go.Picture, "https://upload.wikimedia.org/wikipedia/commons/9/9a/Sample_Floorplan.jpg")
        ));
    }

  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
  }

}
