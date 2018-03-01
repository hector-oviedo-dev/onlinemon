import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventsService } from 'angular4-events';

@Injectable()
export class ServicesService {
  private ws:WebSocket;
  private WS_URL:string = "ws://10.10.2.63:8080";

  public _SERVICE_BASE = "http://localhost:5000/";

  public hardcoded:boolean = false;

  public AUTO_REFRESH_TIME_MINS:number = 1;
  public AUTO_REFRESH_TIME:number = this.AUTO_REFRESH_TIME_MINS * 60 * 100;

  constructor(public http: HttpClient, public events:EventsService) {

  }
  public getMachines() {
    this.doGet("getFirstLoad","").subscribe(
      res => { this.onMachinesResult(res); },
      err => { }
    );
  }
  public onMachinesResult(data) {
    //setTimeout(function(this) { this.getMachines(); }.bind(this), this.AUTO_REFRESH_TIME);

    let res = data.json;

    console.log("quisiera hacer un trace... para")

    this.events.publish("onMachines", res);
  }
  public connect() {

    this.ws = new WebSocket(this.WS_URL, ['echo-protocol']);

    this.ws.onmessage = this.handleMessageReceived.bind(this);

    this.ws.onopen = this.handleConnected.bind(this);

    this.ws.onerror = this.handleError.bind(this);

    this.ws.onclose = this.handleClose.bind(this);
  }
  public disconnect() {
    this.ws.onmessage = function () {};

    this.ws.onopen = function () {};

    this.ws.onerror = function () {};

    this.ws.onclose = function () {};

    this.ws.close();

    this.ws = null;
  }
  private handleMessageReceived(data) {
    //this.events.publish('onMachines', data.data);
  }
  private handleConnected(data) {
    console.log("connected")
    //this._events.publish('onmessage', 'onwsconnect');
/*
    let msg = {
      uid:this.uid,
      msg:"connect"
    }
    this.ws.send(JSON.stringify(msg));*/
  }
  private handleClose(data) {
    console.log("close")
    //this._events.publish('onmessage', 'onwsdisconnect');
    this.connect();
  }
  private handleError(err) {
    //this._events.publish('onerror', err);
  }
  public sendMessage(msg) {
    console.log("sending " + msg)
    this.ws.send(msg);
  }
  public doPost(service, data) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    let url = this._SERVICE_BASE + service;

    return this.http.post(url, data, {headers: headers});
  }
  public doGet(service, data, absoluteURL = false) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    let url
    if (absoluteURL) url = service + data;
    else url = this._SERVICE_BASE + service + data;

    return this.http.get(url, {headers: headers});
  }
}
