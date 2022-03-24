import Message from "../message";

describe("常用返回的消息 Message", () => {

  it("handleMessage:error null", () => {
    // {"flag":"error","message":null}
    let msg = new Message();
    let res = null;
    let handle = msg.handleMessage(res as any);
    //expect(handle.flag).toEqual("error");
    console.log("v:", JSON.stringify(handle));
  });

  it("handleMessage:error string", () => {
    // {"flag":"error","message":"abcd"}
    let msg = new Message();
    let res = 'abcd';
    let handle = msg.handleMessage(res as any);
    //expect(handle.flag).toEqual("error");
    console.log("v:", JSON.stringify(handle));
  });

  it("handleMessage:error 1.0", () => {
    // {"flag":"error","message":{"jsonrpc":"1.0","id":1,"error":{"code":-32700,"message":""}}}
    let msg = new Message();
    let res = { "jsonrpc": "1.0", "id": 1, "error": { "code": -32700, "message": "" } }
    let handle = msg.handleMessage(res as any);
    expect(handle.flag).toEqual("error");
    //console.log("v:",JSON.stringify(handle));
  });

  it("handleMessage:result", () => {
    // {"flag":"result"}
    let msg = new Message();
    let res = { "jsonrpc": "2.0", "id": 1, "result": 'hi,liam' }
    let handle = msg.handleMessage(res as any);
    expect(handle.flag).toEqual("result");
    //console.log("v:",JSON.stringify(handle));
  });

  it("handleMessage:callback", () => {
    // {"flag":"callback"}
    let msg = new Message();
    let res = { "jsonrpc": "2.0", "type": "JSON_RPC_CALLBACK", "id": 1, "params": ["Ask: liam\nAnswer: Sorry, I don't know."] }
    let handle = msg.handleMessage(res as any);
    msg._handleCallback = jest.fn();
    expect(handle.flag).toEqual("callback");
    console.log("v:", JSON.stringify(handle));
  });

  it("handleMessage:hasMethod", () => {
    // {"flag":"hasMethod","message":{"jsonrpc":"2.0","method":"say","id":1,"params":["hi"]}}
    let msg = new Message();
    let res = { "jsonrpc": "2.0", "method": "say", "id": 1, "params": ["hi"] }
    let handle = msg.handleMessage(res as any);
    expect(handle.message.method).toEqual("say");
    //console.log("v:", JSON.stringify(handle));
  });

});
