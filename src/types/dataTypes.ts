export interface ISceneryData {
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

// export interface ITrainData {
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

