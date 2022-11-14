import { ISceneryData } from './dataTypes';

export declare module ApiSWDR {
  export interface IStationsOnline {
    success: boolean;
    respCode: number;
    message: IStationsOnlineMessage[];
  }

  export interface IStationsOnlineMessage {
    dispatcherId: number;
    dispatcherName: string;
    dispatcherIsSupporter: boolean;
    stationName: string;
    stationHash: string;
    region: string;
    maxUsers: number;
    currentUsers: number;
    spawn: number;
    lastSeen: any;
    dispatcherExp: number;
    nameFromHeader: string;
    spawnString: string;
    networkConnectionString: string;
    isOnline: number;
    dispatcherRate: number;
  }

  export interface ITrainsOnline {
    success: boolean;
    respCode: number;
    message: ITrainsOnlineMessage[];
  }

  export interface ITrainsOnlineMessage {
    trainNo: number;
    driverId: number;
    driverName: string;
    driverIsSupporter: boolean;
    dataSignal: string;
    dataSceneryConnection: string;
    dataDistance: number;
    dataCon: string;
    dataSpeed: number;
    dataMass: number;
    dataLength: number;
    region: string;
    isOnline: number;
    lastSeen: number;
    station?: ISceneryData;
  }
}

