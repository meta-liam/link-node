

class PcClient {
  public handleMessage: any = null; //只支持1个
  wsClient: WebSocket; //wsClient
  config: any = {
    port: 52384,
    host: '127.0.0.1',
  };
  connected: boolean = false;
  // pc
  init(port: number = this.config.port, host: string = this.config.host, autoConnect: boolean = true) {
    if (port != this.config.port) this.config.port = port;
    if (host != this.config.host) this.config.host = host;
    if (autoConnect) this.connect();
  }

  callServer(jsonrpc: any = {}) {
    if (this.connected) {
      let data: string;
      if (typeof jsonrpc === "object") {
        data = JSON.stringify(jsonrpc);
      }
      else {
        data = jsonrpc;
      }
      this.wsClient.send(data);
      console.log("callServer:", data);
    }
  }

  setHandle(handle: any) {
    this.handleMessage = handle;
  }

  close() {
    if (!this.connected) {
      return;
    }
    this.connected = false;
    this.removeEventListener(this.wsClient);
    if (this.wsClient) {
      this.wsClient.close();
      this.wsClient = null;
    }
  }

  // callBack(v:string){
  //     console.log("callBackFromApp:",v);
  // }

  async connect(websocket: WebSocket = null) {
    if (websocket && typeof websocket === 'object') {
      this.wsClient = websocket;
    } else {
      this.wsClient = this.creatWebSocket(this.config.port, this.config.host);
    }
    return await this.initSocket(this.wsClient);
  }

  async initSocket(websocket: WebSocket) {
    this.connected = false;
    if (!websocket) {
      return false;
    }
    this.listenSocketEvents(websocket);
    let flag = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (websocket && !this.connected && websocket.readyState) {
          this.connected = true;
        }
        resolve(this.connected ? true : false);
      }, 80);
    });
    return await flag ? true : false;
  }

  creatWebSocket(port: number, host: string): WebSocket {
    const wsUrl = `ws://${host}:${port}`;
    return new WebSocket(wsUrl);
  }

  listenSocketEvents(websocket: WebSocket) {
    if (!websocket) {
      return;
    }
    websocket.addEventListener('open', this.handleSocketClose);
    websocket.addEventListener('message', this.handleSocketMessage);
    websocket.addEventListener('error', this.handleSocketError);
    websocket.addEventListener('close', this.handleSocketClose);
  }

  removeEventListener(websocket: WebSocket) {
    if (!websocket) {
      return;
    }
    websocket.removeEventListener('message', this.handleSocketMessage);
    websocket.removeEventListener('error', this.handleSocketError);
    websocket.removeEventListener('close', this.handleSocketClose);
    websocket.removeEventListener('open', this.handleSocketOpen);
  }

  private handleSocketMessage = (event: MessageEvent) => {
    console.log("[INFO]handleSocketMessage:", event.data);
    try {
      const data = event.data;// JSON.parse(event.data);
      //this._handleMessage(data);
      if (this.handleMessage) {
        this.handleMessage(data);
      }
    } catch (error) {
      console.log("[ERROR]handleSocketMessage:", error);
    }
  };

  private handleSocketClose = (event: MessageEvent) => {
    console.log("[handleSocketClose]", event.type);
    this.close();
  }

  private handleSocketError = (err: any) => {
    console.log("[handleSocketError]", err);
  }

  private handleSocketOpen = (event: MessageEvent) => {
    console.log("[handleSocketOpen]", event);
    if (this.wsClient.readyState) {
      this.connected = true;
    } else {
      this.removeEventListener(this.wsClient);
      this.connected = false;
    }
  }
}

export default PcClient;
