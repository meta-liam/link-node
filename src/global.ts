// app: ios, android : JSBridge
const _global = (window /* browser */ || global /* node */) as any
let _linkCallBackToClient: any = null;

//本方法兼容安卓与iOS
function linkCallMobile(handlerInterface: string = "", handlerMethod: string = "", parameters: string = "", dev: string = "auto") {
  //handlerInterface由iOS addScriptMessageHandler与andorid addJavascriptInterface 代码注入而来。
  var dic = { 'handlerInterface': handlerInterface, 'function': handlerMethod, 'parameters': parameters };
  let isIos = (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent));
  if ((dev === "auto" && isIos) || dev === "ios") {
    isIos = true;
  }
  if (isIos) {
    // @ts-ignore
    window.webkit.messageHandlers[handlerInterface].postMessage(dic);
  } else {
    //安卓传输不了js json对象
    window[handlerInterface][handlerMethod](JSON.stringify(parameters));
  }
}

function linkCallMobileNative(parameters: any, dev: string = "auto") {
  if (!(typeof (parameters) === 'string')) {
    parameters = parameters + '';
  }
  console.log("linkCallMobileNative::", parameters, dev);
  linkCallMobile("LinkNative", "jsonrpc", parameters, dev);//上线
  //linkNativeCallBack(parameters);//mock
}

// APP callBack:
function linkNativeCallBack(v: string) {
  console.log("linkNativeCallBack:", v);
  if (_linkCallBackToClient) {
    _linkCallBackToClient(v);
  }
}

// set
function setLinkCallBack(callBack: any) {
  _linkCallBackToClient = callBack;
}

_global.setLinkCallBack = setLinkCallBack;
_global.linkCallMobileNative = linkCallMobileNative;
_global.linkNativeCallBack = linkNativeCallBack;
