
const _global: any = (global /* node */ || window /* browser */) as any;
class AppClient {
  public handleMessage: any = null;
  device: string = "auto";//设备: auto , ios, android 3个值，默认auto
  constructor() {
  }

  init(device: string = "auto") {
    if (this.device != device) {
      this.device = device;
    }
    _global.setLinkCallBack(this.callBack);
  }

  callServer(jsonrpc: any = {}) {
    let data: string;
    if (typeof jsonrpc === "object") {
      data = JSON.stringify(jsonrpc);
    }
    else {
      data = jsonrpc;
    }
    if (_global.linkCallMobileNative) {
      _global.linkCallMobileNative(data, this.device);
    }
  }

  close() {
    if (_global.setLinkCallBack) {
      _global.setLinkCallBack(null);
    }
    this.handleMessage = null;
  }

  callBack(v: string) {
    console.log("callBackFromApp:", v);
    if (this.handleMessage) {
      this.handleMessage(v);
    }
  }

  setHandle(handle: any) {
    this.handleMessage = handle;
  }

}

export default AppClient;
