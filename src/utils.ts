export enum Device {
    // Mac = 1,
    // Windows= 2,
    PC = 1,
    APP =3
}

export const getDevice = ():number=>{
    return Device.PC;
}
