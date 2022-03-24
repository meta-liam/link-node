import LinkChannel from "../channel";

//let Client = require("../index");
// client = client.default;

describe("Index", () => {
  //let client = new LinkChannel();

  it("constructor:Config", () => {
    let channel = new LinkChannel(false);
    channel.Config.PC.port = 12399;
    expect(channel.Config.PC.port).toEqual(12399);
    expect(channel.Config.platform).toEqual("auto");
    expect(channel.Config.APP.device).toEqual("auto");
    //console.log("v:", 123);
  });

  it("constructor:APP", () => {
    let channel = new LinkChannel(false);
    channel.Config.platform = "app";
    channel.app.init = jest.fn();
    channel.init();
    expect(channel.app.init).toBeCalled();
  });

  it("constructor:PC", () => {
    let channel = new LinkChannel(false);
    channel.Config.platform = "pc";
    channel.pc.init = jest.fn();
    channel.init();
    expect(channel.pc.init).toBeCalled();
  });

  it("close:pc", () => {
    let channel = new LinkChannel(false);
    channel.Config.platform = "pc";
    channel.pc.close = jest.fn();
    channel.close();
    expect(channel.pc.close).toBeCalled();
  });

  it("close:app", () => {
    let channel = new LinkChannel(false);
    channel.Config.platform = "app";
    channel.app.close = jest.fn();
    channel.close();
    expect(channel.app.close).toBeCalled();
  });

  it("sendRPC:app", () => {
    let channel = new LinkChannel(false);
    channel.Config.platform = "app";
    channel.app.send = jest.fn();
    channel.sendRPC({});
    expect(channel.app.send).toBeCalled();
  });

  it("sendRPC:pc", () => {
    let channel = new LinkChannel(false);
    channel.Config.platform = "pc";
    channel.pc.send = jest.fn();
    channel.sendRPC({});
    expect(channel.pc.send).toBeCalled();
  });

  it("setHandle:", () => {
    let channel = new LinkChannel(false);
    channel.setHandle(jest.fn());
    expect(channel.handleClientMessage).toBeDefined();
  });

  it("refresh:", () => {
    let channel = new LinkChannel(false);
    channel.close = jest.fn();
    channel.init = jest.fn();
    channel.refresh();
    expect(channel.close).toBeCalled();
    expect(channel.init).toBeCalled();
  });


  it("_handleMessage:null", () => {
    let channel = new LinkChannel(false);
    //channel.Config.platform = "pc";
    let res = channel._handleMessage("");
    expect(res).toEqual(false);
  });

  it("_handleMessage:{}", () => {
    let channel = new LinkChannel(false);
    channel.handleClientMessage = jest.fn();
    let res = channel._handleMessage("{}");
    expect(res).toEqual(false);
  });

  it("_handleMessage:result", () => {
    let channel = new LinkChannel(false);
    channel.handleClientMessage = jest.fn((v)=>{
      console.log("v:",v);
    });
    let back = { "jsonrpc": "2.0", "id": 1, "result": 'hi,liam' }
    let res = channel._handleMessage(JSON.stringify(back));
    expect(res).toEqual(true);
  });

  it("_handleMessage:JSON_RPC_CALLBACK", () => {
    let channel = new LinkChannel(false);
    channel.handleClientMessage = jest.fn();
    // 注意： id 为callBack 的 id;
    let back =  { "jsonrpc": "2.0", "type": "JSON_RPC_CALLBACK", "id": 1, "params": ["I don't know."] }
    let res = channel._handleMessage(JSON.stringify(back));
    expect(res).toEqual(true);
  });

  it("_handleMessage:error 1", () => {
    let channel = new LinkChannel(false);
    channel.handleClientMessage = jest.fn();
    let back = { "jsonrpc": "1.0", "id": 1, "result": 'hi,liam' }
    let res = channel._handleMessage(JSON.stringify(back));
    expect(res).toEqual(true);
  });


  it("send: result ok", () => {
    let channel = new LinkChannel(false);
    channel.handleClientMessage = jest.fn();
    let r = {"jsonrpc":"2.0","method":"say","params":["liam"],"id":199,"service":"hello-world"};
    let result = channel.send(r.method,r.params,r.service);
    let back = { "jsonrpc": "2.0", "id": 199, "result": 'hi,liam' }
    channel._handleMessage(JSON.stringify(back));
    //console.log("v:",result);
    expect(result).resolves;
  });

  it("send: callback", () => {
    let channel = new LinkChannel(false);
    channel.handleClientMessage = jest.fn();
    let r = {"jsonrpc":"2.0","method":"askAndAnswer","params":["liam",{"type":"JSON_RPC_CALLBACK","id":188}],"id":199,"service":"hello-world"};
    let result = channel.send(r.method,r.params,r.service);
    let back =  { "jsonrpc": "2.0", "type": "JSON_RPC_CALLBACK", "id": 188, "params": ["I don't know."] }
    channel._handleMessage(JSON.stringify(back));
    console.log("v:",result);
    expect(result).resolves;
  });

  it("send: result false1", () => {
    let channel = new LinkChannel(false);
    channel.handleClientMessage = jest.fn();
    let r = {"jsonrpc":"2.0","method":"say","params":["liam"],"id":199,"service":"hello-world"};
    let result = channel.send(r.method,r.params,r.service);
    let back = { "jsonrpc": "1.0", "id": 199, "result": 'hi,liam' }
    channel._handleMessage(JSON.stringify(back));
    console.log("v:",result);
    expect(result).rejects;
  });

  it("send: result false1", () => {
    let channel = new LinkChannel(false);
    channel.handleClientMessage = jest.fn();
    let r = {"jsonrpc":"2.0","method":"say","params":["liam"],"id":199,"service":"hello-world"};
    let result = channel.send(r.method,r.params,r.service);
    let back = { "jsonrpc": "1.0", "id": 199, "error": {"code": -32600, "message": "Invalid Request"} }
    channel._handleMessage(JSON.stringify(back));
    console.log("v:",result);
    expect(result).rejects;
  });



});

