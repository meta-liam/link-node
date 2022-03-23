import Message, { ErrorCode,IRequestMessage } from "../message";

describe("Message", () => {

    it("setRequests",()=>{
        let msg = new Message();
        let req = msg.setRequests(110,{},{});
        expect(msg._openRequests.size).toEqual(1);
        //console.log("v:",msg._openRequests.size);
    });

    it("clear",()=>{
        let msg = new Message();
        new Promise((resolve, reject) => {
            let req = msg.setRequests(110,resolve,reject);
        });
        expect(msg._openRequests.size).toEqual(1);
        msg.clear()
        expect(msg._openRequests.size).toEqual(0);
        //console.log("v:",msg._openRequests.size);
    });

    // 消息 getRequestMessage 放在另外文件

    it("_getRequestMessage",()=>{
        let msg = new Message();
        let req = msg._getRequestMessage("say","",1,"hello-world");
        expect(req.method).toEqual("say");
        //console.log("v:",JSON.stringify(req));
    });

    it("getErrorResponseMessage",()=>{
        // {"jsonrpc":"2.0","id":1,"error":{"code":-32700,"message":""}}
        let msg = new Message();
        let res = msg.getErrorResponseMessage(1,ErrorCode.ParseError,"");
        expect(res.error.code).toEqual(ErrorCode.ParseError);
        console.log("v:",JSON.stringify(res));
    });

    // handleMessage 在另外文件



});