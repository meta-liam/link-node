import {Device,getDevice} from "../utils";
describe("Utils", () => {
    //let client = new Client();
    it("getDevice",()=>{
        let v = getDevice()
        console.log("v:",v);
    });



});