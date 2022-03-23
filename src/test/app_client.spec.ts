import AppClient from '../app_client'

describe("app_client:", () => {
    let client = new AppClient();
    let tsJsonrpc = {"jsonrpc":"2.0","method":"say","params":"liam","id":1,"service":"hello-world"}

    beforeAll(()=>{
        //load();
    })

    it("init:default",()=>{
        global.setLinkCallBack = jest.fn();
        let v = client.init();
        expect(global.setLinkCallBack).toBeCalled();
        expect(client.device).toEqual("auto");
        //console.log("v:",v);
    });

    it("init:ios",()=>{
        global.setLinkCallBack = jest.fn();
        let v = client.init("ios");
        expect(global.setLinkCallBack).toBeCalled();
        expect(client.device).toEqual("ios");
        //console.log("v:",v);
    });

    it("init:android",()=>{
        global.setLinkCallBack = jest.fn();
        let v = client.init("android");
        expect(global.setLinkCallBack).toBeCalled();
        expect(client.device).toEqual("android");
        //console.log("v:",v);
    });

    it("callServer:obj",()=>{
        global.linkCallMobileNative = jest.fn();
        let v = client.callServer(tsJsonrpc);
        expect(global.linkCallMobileNative).toBeCalled();
        //console.log("v:",v);
    });

    it("callServer:string",()=>{
        global.linkCallMobileNative = jest.fn();
        let v = client.callServer(JSON.stringify(tsJsonrpc));
        expect(global.linkCallMobileNative).toBeCalled();
        //console.log("v:",v);
    });

    it("close",()=>{
        global.setLinkCallBack = jest.fn();
        let v = client.close();
        expect(global.setLinkCallBack).toBeCalled();
    });

    it("callBack",()=>{
        client.handleMessage = jest.fn();
        let v = client.callBack("hi");
        expect(client.handleMessage).toBeCalled();
    });

    it("setHandle",()=>{
        let v = client.setHandle(jest.fn());
        expect(client.handleMessage).not.toBeNull();
    });

});