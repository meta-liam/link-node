/**
 * JSON-RPC 错误代码
 */
export enum ErrorCode {
  // Invalid JSON was received by the server.
  // An error occurred on the server while parsing the JSON text.
  ParseError = -32700,
  // The JSON sent is not a valid Request object.
  InvalidRequest = -32600,
  // The method does not exist / is not available.
  MethodNotFound = -32601,
  // Invalid method parameter(s).
  InvalidParams = -32602,
  // Internal JSON-RPC error.
  InternalError = -32603,
  // Reserved for implementation-defined server-errors.
  ServerError = -32099,
}

export interface IRequestMessage {
  jsonrpc: "2.0";
  service?: string;
  method: string;
  params: (string | number | object)[];
  id: number | string;
}
/**
 * 响应消息格式
 */
export interface IResponseMessage {
  jsonrpc: "2.0";
  result?: any;
  error?: IError;
  type?: string;
  params?: any[];
  id: number | string;
}

export interface IError {
  code: ErrorCode;
  message: string;
}

interface IRequest {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}
/**
 *
 *
 * @class Message
 */
class Message {
  // 尽量遵守jsonrpc协议：https://www.jsonrpc.org/specification
  _requestID: number = 1; // 后缀99，区分服务端, 0 为不回应的通知
  _callbackID: number = 1; // 后缀88
  _openRequests: Map<number | string, IRequest> = new Map();
  _callbackListeners: Map<number | string, (...args: any[]) => void> = new Map();

  private CallbackResponse: string = "JSON_RPC_CALLBACK";

  /**
   * 清空事件
   */
  clear() {
    this._callbackListeners.clear();
    this._openRequests.forEach((request) => {
      request.reject();
    });
    this._openRequests.clear();
  }

  /**
   * 设置返回值
   * @param {number} requestID
   * @param {*} resolve
   * @param {*} reject
   * @memberof Message
   */
  setRequests(requestID: number, resolve: any, reject: any) {
    this._openRequests.set(requestID, { resolve, reject });
  }

  /**
   * 返回发送的报文
   */
  getRequestMessage(method: string, params: any, service?: string, id: number = -1): IRequestMessage {
    if (!method) {
      return null;
    }
    let requestID = (this._requestID++) * 100 + 99;
    if (id >= 0) requestID = id;
    let transformedParams;
    if (Array.isArray(params)) {
      transformedParams = params.map((param: any) => {
        if (typeof param === "function") {
          const callbackID = (this._callbackID++) * 100 + 88;
          this._callbackListeners.set(callbackID, param);
          return { type: this.CallbackResponse, id: callbackID };
        }
        return param;
      });
    } else {
      if (!params) params = "";
      transformedParams = params;
    }
    return this._getRequestMessage(method, transformedParams, requestID, service);
  }

  _getRequestMessage(method: string, params: any, id?: number | string, service?: string) {
    const request: IRequestMessage = {
      jsonrpc: "2.0",
      method,
      params,
      id,
      service,
    };
    return request;
  }

  getErrorResponseMessage(id: number, code: ErrorCode, message?: string, result?: any): IResponseMessage {
    const response: IResponseMessage = {
      jsonrpc: "2.0",
      id,
      result,
      error: { code, message },
    };
    return response;
  }


  /**
     * 处理消息
     * @param message
     */
  handleMessage(message: IRequestMessage | IResponseMessage): any {
    if (!message || message.jsonrpc !== "2.0") {
      return { flag: "error", message }
    }
    if (message.hasOwnProperty("method")) {
      //this._handleRequest(message as IRequestMessage);// 循环发信息
      return { flag: "hasMethod", message }
    } else if (message["type"] === this.CallbackResponse) {
      this._handleCallback(message);//callBack的
      return { flag: "callback" }
    } else {
      this._handleResponse(message);//普通返回result
      return { flag: "result" }
    }
  }

  /**
   * 处理接收到的响应消息
   * @param message
   */
  _handleResponse(message: IResponseMessage) {
    const { result, error, id } = message;
    const openRequest = this._openRequests.get(id);
    if (id > 0) this._openRequests.delete(id);// 清理
    if (openRequest) {
      if (error) {
        openRequest.reject(error);
      } else {
        openRequest.resolve(result);
      }
    }
  }

  /**
   * 处理 callback
   * 不作删除,会有多次callback：this._callbackListeners.delete(id)
   * @param message
   */
  _handleCallback(message: IResponseMessage) {
    const { params, id } = message;
    const callback = this._callbackListeners.get(id);
    if (typeof callback === "function") {
      callback(...params);
    }
  }

}

export default Message;
