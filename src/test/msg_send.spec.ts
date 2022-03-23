
import Message from "../message";

describe("常用发送消息 Message", () => {

    it("getRequestMessage:say 1",()=>{
        //{"jsonrpc":"2.0","method":"say","params":"liam","id":1,"service":"hello-world"}
        let msg = new Message();
        let req = msg.getRequestMessage("say",'liam',"hello-world");
        expect(req.params).toEqual('liam');
        //console.log("v:",JSON.stringify(req));
    });

    it("getRequestMessage:say 2",()=>{
        //{"jsonrpc":"2.0","method":"say","params":"","id":1,"service":"hello-world"}
        let msg = new Message();
        let req = msg.getRequestMessage("say",'',"hello-world");
        expect(req.params).toEqual('');
        //console.log("v:",JSON.stringify(req));
    });

    it("getRequestMessage:say null",()=>{
        // {"jsonrpc":"2.0","method":"say","params":"","id":1,"service":"hello-world"}
        let msg = new Message();
        let req = msg.getRequestMessage("say",null,"hello-world");
        expect(req.params).toEqual('');
        //console.log("v:",JSON.stringify(req));
    });

    it("getRequestMessage:say 3",()=>{
        // {"jsonrpc":"2.0","method":"say","params":[],"id":1,"service":"hello-world"}
        let msg = new Message();
        let req = msg.getRequestMessage("say",[],"hello-world");
        expect(req.params).toEqual([]);
        //console.log("v:",JSON.stringify(req));
    });

    it("getRequestMessage:askAndAnswer",()=>{
        // {"jsonrpc":"2.0","method":"askAndAnswer","params":["ask",{"type":"JSON_RPC_CALLBACK","id":1}],"id":1,"service":"hello-world"}
        let msg = new Message();
        let req = msg.getRequestMessage("askAndAnswer",["ask",jest.fn()],"hello-world");
        expect(req.method).toEqual("askAndAnswer");
        //console.log("v:",JSON.stringify(req));
    });

    it("getRequestMessage:listen",()=>{
        // {"jsonrpc":"2.0","method":"listen","params":[{"type":"JSON_RPC_CALLBACK","id":1}],"id":1,"service":"hello-world"}
        let msg = new Message();
        let req = msg.getRequestMessage("listen",[jest.fn((v)=>{console.log(v);})],"hello-world");
        expect(req.method).toEqual("listen");
        //console.log("v:",JSON.stringify(req));
    });

    // 握手
    it("getRequestMessage:shake_hands",()=>{
        // {"jsonrpc":"2.0","method":"shake_hands","params":["1.0.0"],"id":1,"service":""}
        let msg = new Message();
        let req = msg.getRequestMessage("shake_hands",["1.0.0"],"");
        expect(req.method).toEqual("shake_hands");
        console.log("v:",JSON.stringify(req));
    });

    // 初起化服务：
    it("getRequestMessage:init",()=>{
        // {"jsonrpc":"2.0","method":"init","params":["[\"hello-world.listen\",\"hello-world2.xxx\"]"],"id":1,"service":""}
        let msg = new Message();
        let ls = JSON.stringify(["hello-world.listen","hello-world2.xxx"]);//要init启动的服务
        let req = msg.getRequestMessage("init",[ls],"");
        //expect(req.method).toEqual("notify_init");
        console.log("v:",JSON.stringify(req));
    });

    // 关闭，id=0 不回消息
    it("getRequestMessage:notify_close",()=>{
        // {"jsonrpc":"2.0","method":"notify_close","params":"","id":0,"service":""}
        let msg = new Message();
        let req = msg.getRequestMessage("notify_close","","",0);
        expect(req.method).toEqual("notify_close");
        //console.log("v:",JSON.stringify(req));
    });
});
