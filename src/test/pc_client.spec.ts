import PcClient from '../pc_client'
import WS from "jest-websocket-mock";

describe("pc_client:", () => {
    let client = new PcClient();
    let tsJsonrpc = {"jsonrpc":"2.0","method":"say","params":"liam","id":1,"service":"hello-world"}
    let mockClient: WebSocket;
    let mockServer: any;

    beforeAll(async () => {
        mockServer = new WS("ws://localhost:21345");
        mockClient = new WebSocket("ws://localhost:21345");
        await mockServer.connected;
    });

    afterAll(() => {
        WS.clean();
    });

    it("init:connect",()=>{
        client.connect = jest.fn();
        let v = client.init(123450,'localhost',false);
        expect(client.connect).not.toBeCalled();
        expect(client.config.port).toEqual(123450);
    });

    it("callServer:obj",()=>{
        client.connected = true;
        client.wsClient = mockClient;
        client.wsClient.send = jest.fn();
        client.callServer(tsJsonrpc);
        expect(client.wsClient.send).toBeCalled();
    });

    it("callServer:string",()=>{
        client.connected = true;
        client.wsClient = mockClient;
        client.wsClient.send = jest.fn();
        client.callServer(JSON.stringify(tsJsonrpc));
        expect(client.wsClient.send).toBeCalled();
    });

    it("setHandle",()=>{
        let v = client.setHandle(jest.fn());
        expect(client.handleMessage).not.toBeNull();
    });

    it("connect:mockClient",()=>{
        let client2 = new PcClient();
        let mockClient2 :WebSocket= new WebSocket("ws://localhost:21305");
        client2.initSocket = jest.fn();
        let v = client2.connect(mockClient2);
        expect(client2.wsClient).not.toBeNull();
        expect(client2.initSocket).toBeCalled();
    });

    it("connect:null",()=>{
        let client2 = new PcClient();
        client2.creatWebSocket = jest.fn();
        client2.initSocket = jest.fn();
        let v = client2.connect();
        expect(client2.creatWebSocket).toBeCalled();
        expect(client2.initSocket).toBeCalled();
    });

    it("initSocket:",()=>{
        let client2 = new PcClient();
        let mockClient2 :WebSocket= new WebSocket("ws://localhost:21301");
        client2.listenSocketEvents = jest.fn();
        let v = client2.initSocket(mockClient2);
        expect(client2.listenSocketEvents).toBeCalled();
    });

    it("creatWebSocket:",()=>{
        let v = client.creatWebSocket(12789,"localhost");
        expect(v).not.toEqual(null);
    });

    it("close:connected true",()=>{
        let client2 = new PcClient();
        client2.removeEventListener = jest.fn();
        let v = client2.close();
        expect(client2.connected).toEqual(false);
        expect(client2.removeEventListener).not.toBeCalled();
    });

    it("close:connected false",()=>{
        let mockClient2 :WebSocket= new WebSocket("ws://localhost:21301");
        let client2 = new PcClient();
        client2.removeEventListener = jest.fn();
        client2.connected = true;
        client2.wsClient = mockClient2;
        let v = client2.close();
        expect(client2.connected).toEqual(false);
        expect(client2.removeEventListener).toBeCalled();
    });

    it("listenSocketEvents:",async ()=>{
        let mockServer2 = new WS("ws://localhost:21315");
        let mockClient2 = new WebSocket("ws://localhost:21315");
        let client2 = new PcClient();
        client2.initSocket(mockClient2)
        //client2.listenSocketEvents(mockClient2);
        await mockServer2.connected;
        //expect(v).not.toEqual(null);
        return new Promise(res => {
            setTimeout(async () => {
                //console.log("connected:",client2.connected);
                expect(client2.connected).toEqual(true);
                res(1);
            }, 100);
        });
    });

    it('test 发信息给服务端1', async () => {
        let mockServer2 = new WS("ws://localhost:21319");
        let mockClient2 = new WebSocket("ws://localhost:21319");
        await mockServer2.connected;
        let client2 = new PcClient();
        let connect = await client2.connect(mockClient2);
        expect(connect).toEqual(true);
        client2.callServer("hello");
        await expect(mockServer2).toReceiveMessage("hello");
        expect(mockServer2).toHaveReceivedMessages(["hello"]);

        let wait = new Promise<boolean>((resolve) => {
            setTimeout(() => {
                resolve(true);
            },180);
        });
        await wait;
    });

    it('test 监听服务端消息', async () => {
        let mockServer2 = new WS("ws://localhost:21319");
        let mockClient2 = new WebSocket("ws://localhost:21319");
        await mockServer2.connected;
        let client2 = new PcClient();
        let connect = await client2.connect(mockClient2);
        expect(connect).toEqual(true);
        let st = '{"jsonrpc":"2.0","method":"say","params":"liam","id":1,"service":"hello-world"}';
        let back = '{"jsonrpc":"2.0","id":1,"result":"hi,liam"}';
        client2.callServer(st);
        await expect(mockServer2).toReceiveMessage(st);
        expect(mockServer2).toHaveReceivedMessages([st]);
        mockClient2.onmessage = (e) => {
            //console.log("onmessage::",e.data);
            expect(e.data).toEqual(back);
        };
        //back
        mockServer2.send(back);
        // wait:
        let wait = new Promise<boolean>((resolve) => {
            setTimeout(() => {
                resolve(true);
            },180);
        });
        await wait;
    });


});
