# link-node

node语言实现的链接多端的胶水服务。

## 使用安装

```shell
npm install link-node

npm i link-node --registry=https://registry.npmmirror.com
```

## 例子

```ts
import LinkChannel from 'link-node';

callBack=(v)=> {
  console.log("call back::", v);
}

const channel = new LinkChannel(false);
channel.setHandle(this.callBack);
channel.Config.platform ="auto";
channel.Config.PC.port = 8888;
channel.Config.PC.host = "localhost";
channel.init();

setTimeout(() => {
   let r = { "jsonrpc": "2.0", "method": "say", "params": ["liam"], "id": 99, "service": "hello-world" };
   let result = channel.send(r.method, r.params, r.service);
   console.log(result);
}, 180);

```

[Vue3使用例子](https://github.com/meta-liam/vue3-vite-demo)

[开发文档](https://github.com/meta-liam/link-node)
