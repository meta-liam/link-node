import Client from "../client";

//let Client = require("../index");
// client = client.default;

describe("Index", () => {
    let client = new Client();

    it("Run",()=>{
        let v = client.callServer({"jsonrpc":"2.0","method":"say","params":"liam","id":1,"service":"hello-world"})
        console.log("v:",v);
    });

});

