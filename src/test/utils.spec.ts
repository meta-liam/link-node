import {  getDevice, getPlatform } from "../utils";

describe('Utils:', () => {

  test('getPlatform:PC', () => {
    let userAgent = (
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4)\
             AppleWebKit/600.1.2 (KHTML, like Gecko)\
             Version/13.0.0 Safari/600.1.2'
    );
    let res = getDevice(userAgent);
    expect(res.isPc).toEqual(true);
    //console.log("v:", res);
  });

  test('getPlatform: android', () => {
      let userAgent = (
      '"Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.3'
    );
    let res = getDevice(userAgent);
    expect(res.isAndroid).toEqual(true);
    //console.log("v:", res);
  });

  test('getPlatform:ios', () => {
    let userAgent =  (
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1'
    );
    let res = getDevice(userAgent);
    expect(res.isPhone).toEqual(true);
    //console.log("v:", res);
  });

  test('getPlatform: xx', () => {
    let res = getPlatform();
    expect(res).not.toEqual(null);
    //console.log("v:", res);
  });

});
