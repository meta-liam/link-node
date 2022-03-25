import LinkChannel from "../index";

/**
 * 联合测试
 */

describe("Unity:pc", () => {
  /** 收到
   * {"jsonrpc":"2.0","method":"nofifyMessage","params":{}}
   * {"jsonrpc":"2.0","method":"notifyConnected","params":[{"version":"1.0.0","name":"discovery","author":"makeblock"},{"version":"1.0.0","name":"hello-world","author":"makeblock"},{"version":"1.0.0","name":"service-global","author":"makeblock"},{"version":"1.0.0","name":"xserialport","author":""}]}
   *
   */
  let channel = new LinkChannel(false);

  beforeAll(async () => {
    loadServer();
    let wait = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 80);
    });
    await wait;
  });

  const loadServer = async () => {
    let handleClientMessage = (v: any) => {
      console.log("[TEST]handleClientMessage:::", v);
    };
    channel.setHandle(handleClientMessage);
    channel.Config.platform = "pc";
    channel.Config.PC.port = 8888;
    channel.init();
  };

  it("pc:service-global.init", async () => {
    //let r = {"jsonrpc":"2.0","method":"say","params":["liam"],"id":199,"service":"hello-world"};
    let r = { "jsonrpc": "2.0", "method": "init", "params": ["{}"], "id": 199, "service": "service-global" };
    let result = channel.send(r.method, r.params, r.service);
    console.log('result::', result);

    let wait = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 180);
    });
    await wait;
  });

  it("pc:service-global.getVersion", async () => {
    let r = { "jsonrpc": "2.0", "method": "getVersion", "params": [""], "id": 199, "service": "service-global" };
    let result = channel.send(r.method, r.params, r.service);
    console.log('result::', result);
    let wait = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 180);
    });
    await wait;
  });

  it("pc:service-global.close", async () => {
    let r = { "jsonrpc": "2.0", "method": "close", "params": [""], "id": 199, "service": "service-global" };
    let result = channel.send(r.method, r.params, r.service);
    console.log('result::', result);
    let wait = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 180);
    });
    await wait;
  });

  it("pc:service-global.askAndAnswer", async () => {
    let r = { "jsonrpc": "2.0", "method": "askAndAnswer", "params": ["liam", { "type": "JSON_RPC_CALLBACK", "id": 188 }], "id": 199, "service": "service-global" };
    let result = channel.send(r.method, r.params, r.service);
    console.log('result::', result);
    let wait = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 180);
    });
    await wait;
  });

  it("pc:service-global.listen", async () => {
    let r = { "jsonrpc": "2.0", "method": "listen", "params": [{ "type": "JSON_RPC_CALLBACK", "id": 188 }, 2, 10], "id": 199, "service": "service-global" };
    let result = channel.send(r.method, r.params, r.service);
    console.log('result::', result);
    let wait = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 180);
    });
    await wait;
  });

});


// describe("Unity:app", () => {

// });
