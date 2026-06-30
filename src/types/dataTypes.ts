export interface ISceneryOnline {
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

export interface ISceneryData {
  id: string;
  name: string;
  abbr: string;
  SUP: boolean;
  authors: string;
  availability: string;
  checkpoints: string;
  controlType: string;
  lines: string;
  project: string;
  reqLevel: number;
  routes: string;
  signalType: string;
  url: string;
}