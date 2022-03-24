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
    let res = channel._handleMessage({});
    expect(res).toEqual(false);
  });


});

