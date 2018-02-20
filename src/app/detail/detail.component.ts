import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  public sides = [];
  public details = [];
  constructor() {

    //CONTENIDO IZQUIERDA
    //LISTA DE 'ROWS'
    this.sides.push(
      {
        cols:[
          { label:"UID:", width:"33%" },
          { label:"MARCA:", width:"33%" },
          { label:"VC", width:"33%" },
        ]
      }
    );
    this.sides.push(
      {
        cols:[
          { label:"000331", width:"33%", border:"1px solid gray", color:"#ffe4b5" },
          { label:"IGT", width:"33%", border:"1px solid gray", color:"#ffe4b5" },
          { label:"2.0", width:"33%", border:"1px solid gray", color:"#ffe4b5" },
        ]
      }
    );

  //CONTENIDO TAB
  //LISTA DE 'ROWS'
  let dataCont = [
      {
        cols:[
          { label:"Ultima Actualizacion", width:"20%" },
          { label:"03/02/2016 11:52:41", width:"80%", border:"1px solid gray", color:"#ffc0c0" },
        ]
      },
      {
        cols:[
          { label:"COIN IN", width:"25%" },
          { label:"430086", width:"25%", border:"1px solid gray", color:"#ffffc0" },
          { label:"JUGADAS", width:"25%" },
          { label:"263", width:"25%", border:"1px solid gray", color:"#ffffc0" },
        ]
      },
      {
        cols:[
          { label:"COIN OUT", width:"25%" },
          { label:"26471", width:"25%", border:"1px solid gray", color:"#ffffc0" },
          { label:"GANADAS", width:"25%" },
          { label:"112", width:"25%", border:"1px solid gray", color:"#ffffc0" },
        ]
      },
      {
        cols:[
          { label:"HAND PAY", width:"25%" },
          { label:"400000", width:"25%", border:"1px solid gray", color:"#ffffc0" },
          { label:"CANCEL CREDIT", width:"25%" },
          { label:"27359", width:"25%", border:"1px solid gray", color:"#ffffc0" },
        ]
      },
      {
        cols:[
          { label:"DROP", width:"25%" },
          { label:"43978", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
          { label:"APER. PUERTA", width:"25%" },
          { label:"63", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
        ]
      },
      {
        cols:[
          { label:"CRED.ACTUALES", width:"25%" },
          { label:"4", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
          { label:"POWER RESET", width:"25%" },
          { label:"45", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
        ]
      },
      {
        cols:[
          { label:"HOPPER TEOR.", width:"25%" },
          { label:"0", width:"25%", border:"1px solid gray", color:"#d8bfd8" },
          { label:"VF", width:"25%" },
          { label:"0", width:"25%", border:"1px solid gray", color:"#d8bfd8" },
        ]
      },
    ];

  //CONTENIDO TAB
  //LISTA DE 'ROWS'
  let dataBill = [
      {
        cols:[
          { label:"Hora Inicial", width:"25%" },
          { label:"03/02/2016 11:52:41", width:"25%" },
          { label:"Ultima Actualizacion", width:"25%" },
          { label:"03/02/2016 11:52:41", width:"25%" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 2,00", width:"25%" },
          { label:"5", width:"25%",border:"1px solid" },
          { label:"5", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 5,00", width:"25%" },
          { label:"8", width:"25%",border:"1px solid" },
          { label:"8", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 10,00", width:"25%" },
          { label:"10", width:"25%",border:"1px solid" },
          { label:"10", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 20,00", width:"25%" },
          { label:"20", width:"25%",border:"1px solid" },
          { label:"20", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 50,00", width:"25%" },
          { label:"19", width:"25%",border:"1px solid" },
          { label:"19", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"Denominacion $ 100,00", width:"25%" },
          { label:"5", width:"25%",border:"1px solid" },
          { label:"5", width:"25%",border:"1px solid" },
          { label:"0", width:"25%",border:"1px solid" },
        ]
      },
      {
        cols:[
          { label:"", width:"100%" },
        ]
      },
      {
        cols:[
          { label:"", width:"25%" },
          { label:"", width:"25%" },
          { label:"Billetes", width:"25%" },
          { label:"$ 0", width:"25%" },
        ]
      },
    ];


    //CONTENIDO TAB
    //LISTA DE 'ROWS'
    let dataProd = [
        {
          cols:[
            { label:"Hora Inicial", width:"25%" },
            { label:"03/02/2016 11:52:41", width:"25%", border:"1px solid gray", color:"#b0c4de" },
            { label:"Ultima Actualizacion", width:"25%" },
            { label:"03/02/2016 11:52:41", width:"25%", border:"1px solid gray", color:"#b0c4de" },
          ]
        },
        {
          cols:[
            { label:"COIN IN", width:"25%" },
            { label:"430086", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"4000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"5000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"COIN OUT", width:"25%" },
            { label:"430086", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"4000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"5000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"JACK POT", width:"25%" },
            { label:"400000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"234325", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"27359", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"HAND PAY", width:"25%" },
            { label:"400000", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"55764", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"27359", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"", width:"25%" },
            { label:"", width:"25%" },
            { label:"PRODUCIDO", width:"25%" },
            { label:"$ 0.00", width:"25%", border:"1px solid gray", color:"#4682b4" },
          ]
        },
        {
          cols:[
            { label:"JUGADAS", width:"25%" },
            { label:"400000", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"55764", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"27359", width:"25%", border:"1px solid gray", color:"#fffacd" },
          ]
        },
        {
          cols:[
            { label:"GANADAS", width:"25%" },
            { label:"400000", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"55764", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"27359", width:"25%", border:"1px solid gray", color:"#fffacd" },
          ]
        },
        {
          cols:[
            { label:"BILL DROP", width:"25%" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#fffacd" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#fffacd" },
          ]
        },
        {
          cols:[
            { label:"DROP", width:"25%" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
            { label:"33", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
          ]
        },
      ];

    //CONTENIDO TAB
    //LISTA DE 'ROWS'
    let dataCon = [
        {
          cols:[
            { label:"IP", width:"25%" },
            { label:"10.10.1.102", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
            { label:"Puerto", width:"25%" },
            { label:"1401", width:"25%", border:"1px solid gray", color:"#c0c0ff" },
          ]
        },
      ]

    //CONTENIDO TAB
    //LISTA DE 'ROWS'
    let dataEXT = [
        {
          cols:[
            { label:"", width:"25%" },
            { label:"COIN IN", width:"25%" },
            { label:"", width:"25%" },
            { label:"", width:"25%" },
          ]
        },
        {
          cols:[
            { label:"Juego 01", width:"25%" },
            { label:"16440", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"Match Paid Progr. Win", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"Juego 02", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"Match Paid Ext. Bonus", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"Juego 03", width:"25%" },
            { label:"26646", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"Attend. Paid Prog. Win", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"Juego 04", width:"25%" },
            { label:"26646", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"Attend. Paid Ext. Bonus", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"Juego 05", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"total Handpay", width:"25%" },
            { label:"2240", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
        {
          cols:[
            { label:"TrueCoinIN", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
            { label:"TrueCoinOUT", width:"25%" },
            { label:"0", width:"25%", border:"1px solid gray", color:"#b0e0e6" },
          ]
        },
      ]

    ///TABS
    this.details.push(
    {
      label:"Contadores",
      //CONTENIDO TAB 1
      data:JSON.stringify(dataCont),
    },
    {
      label:"Billetero",
      //CONTENIDO TAB 2
      data:JSON.stringify(dataBill),
    },
    {
      label:"Pagos Manuales",
      //CONTENIDO TAB 3
      data:JSON.stringify(dataCont),
    },
    {
      label:"Eventos",
      //CONTENIDO TAB 4
      data:JSON.stringify(dataCont),
    },
    {
      label:"Producido",
      //CONTENIDO TAB 5
      data:JSON.stringify(dataProd),
    },
    {
      label:"Conexion",
      //CONTENIDO TAB 6
      data:JSON.stringify(dataCon),
    },
    {
      label:"EXT",
      //CONTENIDO TAB 7
      data:JSON.stringify(dataEXT),
    },
    )

  }


  ngOnInit() {
  }

}
