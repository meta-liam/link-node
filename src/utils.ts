import {Platform} from './enum'

export const getPlatform = (): string => {
  const dev = getDevice()
  if (dev.isTablet || dev.isAndroid || dev.isPhone){
    return Platform.app ;
  }
  else return Platform.pc;
};

export const getDevice = () => {
    var ua = navigator.userAgent as any ;
    let isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
    return {
         isTablet: isTablet,
         isPhone: isPhone,
         isAndroid : isAndroid,
         isPc : isPc
    };
}
