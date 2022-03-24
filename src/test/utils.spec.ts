import {  getDevice, getPlatform } from "../utils";

describe('Utils:', () => {
  const _global = ( global /* node */) as any

  test('getPlatform:PC', () => {
    _global.navigator= {
      userAgent : (
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4)\
             AppleWebKit/600.1.2 (KHTML, like Gecko)\
             Version/13.0.0 Safari/600.1.2'
    )};
    let res = getPlatform();
    expect(res).toEqual('pc');
    //console.log("v:", res);
  });

  test('getPlatform: android', () => {
    _global.navigator= {
      userAgent : (
      '"Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.3'
    )};
    let res = getPlatform();
    expect(res).toEqual('app');
    //console.log("v:", res);
  });

  test('getPlatform:ios', () => {
    _global.navigator= {
      userAgent : (
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1'
    )};
    let res = getPlatform();
    expect(res).toEqual('app');
    //console.log("v:", res);
  });


});
