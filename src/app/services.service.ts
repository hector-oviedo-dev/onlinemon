import { Injectable } from '@angular/core';

@Injectable()
export class ServicesService {
  private ws:WebSocket;
  private WS_URL:string = "ws://10.10.2.50:8081";
  constructor() {

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
    console.log("data " + data.data)
    //this._events.publish('onmessage', data.data);
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
    this.ws.send(msg);
  }
}