import { getPlatform } from './utils'
import {Platform,Device} from './enum'
import AppChannel from './app_channel'
import PcChannel from './pc_channel';
import Message from './message'

class LinkChannel {
  private app: AppChannel = new AppChannel();
  private pc: PcChannel = new PcChannel();
  private msg: Message = new Message();
  public handleClientMessage: any = null;// 发回client的消息
  // config
  Config: any = {
    PC:{ port: 52384,host: '127.0.0.1'} ,
    APP:{ device:Device.auto},
    platform: Platform.auto
  };

  constructor(autoInit: boolean = true) {
    if (autoInit) this.init();
  }

  init() {
    if(this.Config.platform ==Platform.auto ) this.Config.platform = getPlatform();
    if (this.Config.platform == Platform.app) {
      this.app.init(this.Config.APP.device);
      this.app.setHandle(this._handleMessage)
    } else {
      this.pc.init(this.Config.PC.port, this.Config.PC.host);
      this.app.setHandle(this._handleMessage)
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
    this.handleClientMessage =null;
    if (this.Config.platform == Platform.app) {
      this.app.close();
    } else {
      this.pc.close();
    }
    this.msg.clear();
  }

  callServer(jsonrpc: any = {}) {
    if (this.Config.platform == Platform.app) {
      this.app.callServer(jsonrpc)
    } else {
      this.pc.callServer(jsonrpc)
    }
  }

  _handleMessage(v: any) {
    console.log("[client]_handleMessage:", v);
    const data = JSON.parse(v);
    const res = this.msg.handleMessage(data);
    if (res.flag === "hasMethod") { // server主动请求Client中的方法
      //const { method, params, id, server } = res.message;
      //this.send(method, params, server, id);
      if(this.handleClientMessage) this.handleClientMessage({"type":"data",data:res.message});
    }
    console.log("result:", res);
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
