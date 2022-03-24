import { Device, getDevice } from './utils'
import AppChannel from './app_channel'
import PcChannel from './pc_channel';
import Message from './message'

let Config = {
  port: 52384,
  host: '127.0.0.1',
};

class LinkChannel {
  private device: Device = Device.PC;
  private app: AppChannel = new AppChannel();
  private pc: PcChannel = new PcChannel();
  private msg: Message = new Message();
  constructor(autoInit: boolean = true) {
    if (autoInit) this.init();
  }

  init(port: number = Config.port, host: string = Config.host) {
    this.device = getDevice();
    if (this.device == Device.APP) {
      this.app.init();
      this.app.setHandle(this.handleMessage)
    } else {
      if (port != Config.port) Config.port = port;
      if (host != Config.host) Config.host = host;
      this.pc.init(port, host);
      this.app.setHandle(this.handleMessage)
    }
  }

  send(method: string, params: any[], service?: string, id: number = -1): any {
    const request = this.msg.getRequestMessage(method, params, service, id);
    if (!request) {
      return;
    }
    const promise = new Promise((resolve, reject) => {
      this.msg._openRequests.set(request.id, { resolve, reject });
    });
    this.callServer(request);
    return promise;
  }

  close() {
    if (this.device == Device.APP) {
      this.app.close();
    } else {
      this.pc.close();
    }
    this.msg.clear();
  }

  callServer(jsonrpc: any = {}) {
    if (this.device == Device.APP) {
      this.app.callServer(jsonrpc)
    } else {
      this.pc.callServer(jsonrpc)
    }
  }

  handleMessage(v: any) {
    console.log("[client]handleMessage:", v);
    const data = JSON.parse(v);
    const res = this.msg.handleMessage(data);
    if (res.flag === "hasMethod") { // 循环请求
      const { method, params, id, server } = res.message;
      this.send(method, params, server, id);
    }
    console.log("result:", res);
  }

  refresh() {
    this.close();
    this.init();
  }

}

export default LinkChannel;
module.exports = LinkChannel;
