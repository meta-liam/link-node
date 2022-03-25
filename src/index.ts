import { getPlatform } from './utils'
import { Platform, Device } from './enum'
import AppChannel from './app_channel'
import PcChannel from './pc_channel';
import Message from './message'

class LinkChannel {
  app: AppChannel = new AppChannel();
  pc: PcChannel = new PcChannel();
  msg: Message = new Message();
  public handleClientMessage: any = null;// 发回client的消息
  // config
  Config: any = {
    PC: { port: 52384, host: '127.0.0.1' },
    APP: { device: Device.auto },
    platform: Platform.auto
  };

  constructor(autoInit: boolean = true) {
    if (autoInit) this.init();
  }

  init() {
    console.log("[INFO][channel]init:");
    if (this.Config.platform == Platform.auto) this.Config.platform = getPlatform();
    if (this.Config.platform == Platform.app) {
      this.app.setHandle(this._handleMessage);
      this.app.init(this.Config.APP.device);
    } else {
      this.pc.setHandle(this._handleMessage);
      this.pc.init(this.Config.PC.port, this.Config.PC.host);
    }
  }

  // TODO test
  send(method: string, params: any[], service?: string, id: number = -1): any {
    const request = this.msg.getRequestMessage(method, params, service, id);
    if (!request) {
      return;
    }
    const promise = new Promise((resolve, reject) => {
      this.msg._openRequests.set(request.id, { resolve, reject });
    });
    this.sendRPC(request);
    return promise;
  }

  close() {
    this.handleClientMessage = null;
    if (this.Config.platform == Platform.app) {
      this.app.close();
    } else {
      this.pc.close();
    }
    this.msg.clear();
  }

  sendRPC(jsonrpc: any = {}) {
    if (this.Config.platform == Platform.app) {
      this.app.send(jsonrpc)
    } else {
      this.pc.send(jsonrpc)
    }
  }

  _handleMessage = (v: any) => {
    console.log("[INFO][channel]_handleMessage:", v);
    if (!v || v.indexOf("jsonrpc") == -1) {
      if (this.handleClientMessage) this.handleClientMessage({ "type": "error", data: v });
      return false;
    }
    const data = JSON.parse(v);
    const res = this.msg.handleMessage(data);
    if (this.handleClientMessage) this.handleClientMessage({ "type": res.flag, data: res.message });
    console.log("[INFO][channel]_handleMessage:res:", res);
    return true;
  }

  setHandle(handle: any) {
    this.handleClientMessage = handle;
  }

  refresh() {
    this.close();
    this.init();
  }

}

export default LinkChannel;
module.exports = LinkChannel;
