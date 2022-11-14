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

  // export interface ITrainsOnline {
  //   success: boolean;
  //   respCode: number;
  //   message: ITrainsOnlineMessage[];
  // }

  // export interface ITrainsOnlineMessage {
  //   trainNo: number;
  //   driverId: number;
  //   driverName: string;
  //   driverIsSupporter: boolean;
  //   dataSignal: string;
  //   dataSceneryConnection: string;
  //   dataDistance: number;
  //   dataCon: string;
  //   dataSpeed: number;
  //   dataMass: number;
  //   dataLength: number;
  //   region: string;
  //   isOnline: number;
  //   lastSeen: number;
  //   station?: ISceneryData;
  // }
}

export declare module ApiStacjownik {
  export interface IActiveTrain {
    trainNo: number;

    mass: number;
    length: number;
    speed: number;

    signal: string;
    distance: number;
    connectedTrack: string;
    stockString: string;

    driverName: string;
    driverId: number;
    driverIsSupporter: boolean;

    currentStationName: string;
    currentStationHash?: string;

    online: boolean;
    lastSeen: number;

    region: string;

    timetable?: {
      timetableId: number;
      category: string;
      route: string;
      stopList: IActiveTrainStop[];
      TWR: boolean;
      SKR: boolean;
      sceneries: string[];
    };

    isTimeout: boolean;
  }

  export interface IActiveTrainStop {
    stopName: string;
    stopNameRAW: string;
    stopType: string;
    stopDistance: number;
    pointId: number;

    mainStop: boolean;

    arrivalLine: string;
    arrivalTimestamp: number;
    arrivalRealTimestamp: number;
    arrivalDelay: number;

    departureLine: string;
    departureTimestamp: number;
    departureRealTimestamp: number;
    departureDelay: number;

    comments?: any;

    beginsHere: boolean;
    terminatesHere: boolean;
    confirmed: boolean;
    stopped: boolean;
    stopTime: number;
  }
} 