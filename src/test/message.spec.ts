import Message, { ErrorCode, IRequestMessage } from "../message";

describe("Message", () => {

  it("setRequests", () => {
    let msg = new Message();
    let req = msg.setRequests(110, {}, {});
    expect(msg._openRequests.size).toEqual(1);
    //console.log("v:",msg._openRequests.size);
    msg._openRequests.delete(110);
  });

  it("clear", () => {
    let msg = new Message();
    msg._callbackListeners.set(288, jest.fn());
    expect(msg._callbackListeners.size).toEqual(1);
    msg.clear()
    expect(msg._callbackListeners.size).toEqual(0);
    //console.log("v:",msg._openRequests.size);
  });

  // 消息 getRequestMessage 放在另外文件

  it("_getRequestMessage", () => {
    let msg = new Message();
    let req = msg._getRequestMessage("say", "", 1, "hello-world");
    expect(req.method).toEqual("say");
    //console.log("v:",JSON.stringify(req));
  });

  it("getErrorResponseMessage", () => {
    // {"jsonrpc":"2.0","id":1,"error":{"code":-32700,"message":""}}
    let msg = new Message();
    let res = msg.getErrorResponseMessage(1, ErrorCode.ParseError, "");
    expect(res.error.code).toEqual(ErrorCode.ParseError);
    console.log("v:", JSON.stringify(res));
  });

  // handleMessage 在另外文件

  it("_openRequests:操作1", () => {
    let msg = new Message();
    let id = 199;
    msg.setRequests(id + 1, {}, {});
    const openRequest = msg._openRequests.get(id);
    msg._openRequests.delete(id);
    // console.log("v",msg._openRequests);
    // console.log("v",openRequest);
    expect(msg._openRequests.size).toEqual(1);
    expect(openRequest).toBeUndefined();
    msg._openRequests.delete(id + 1);
  });

  it("_openRequests:操作2", () => {
    let msg = new Message();
    let id = 199;
    msg.setRequests(id, {}, {});
    expect(msg._openRequests.size).toEqual(1);
    const openRequest = msg._openRequests.get(id);
    expect(openRequest).toBeDefined();
    msg._openRequests.delete(id);
    // console.log("v",msg._openRequests);
    // console.log("v",openRequest);
    expect(msg._openRequests.size).toEqual(0);
  });

  it("getRequestMessage:操作2", () => {
    let msg = new Message();
    let id = 199;
    let back = { "jsonrpc": "2.0", "id": id, "result": 'hi,liam' }
    let req = msg.getRequestMessage("say", "hi", "", id);
    const promise = new Promise((resolve, reject) => {
      msg._openRequests.set(id, { resolve, reject });
    });
    msg._handleResponse(back as any);
    //console.log("v:",promise);
    expect(promise).resolves;
  });

});
