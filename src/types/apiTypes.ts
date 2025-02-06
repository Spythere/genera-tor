export declare module API {
  export namespace ActiveData {
    export interface Response {
      activeSceneries?: API.ActiveSceneries.Response;
      trains?: API.ActiveTrains.Response;
    }
  }

  export namespace ActiveSceneries {
    export interface Data {
      dispatcherId: number;
      dispatcherName: string;
      dispatcherIsSupporter: boolean;
      stationName: string;
      stationHash: string;
      region: string;
      maxUsers: number;
      currentUsers: number;
      spawn: number;
      lastSeen: number;
      dispatcherExp: number;
      nameFromHeader: string;
      spawnString: string | null;
      networkConnectionString: string;
      isOnline: number;
      dispatcherRate: number;
      dispatcherStatus: number;
    }

    export type Response = Data[];
  }

  export namespace ActiveTrains {
    export type Response = Data[];

    export interface Data {
      trainNo: number;

      mass: number;
      length: number;
      speed: number;
      stockString: string;

      signal: string;
      distance: number;
      connectedTrack: string;

      driverName: string;
      driverId: number;
      driverIsSupporter: boolean;
      driverLevel?: number;

      currentStationName: string;
      currentStationHash?: string;

      online: number;
      lastSeen: number;

      region: string;
      isTimeout: boolean;

      timetable?: Timetable;
    }

    export interface TimetableStop {
      stopName: string;
      stopNameRAW: string;
      stopType: string;
      stopDistance: number;
      pointId: string;

      mainStop: boolean;

      arrivalLine: string | null;
      arrivalTimestamp: number;
      arrivalRealTimestamp: number;
      arrivalDelay: number;

      departureLine: string | null;
      departureTimestamp: number;
      departureRealTimestamp: number;
      departureDelay: number;

      comments?: any;

      beginsHere: boolean;
      terminatesHere: boolean;
      confirmed: number;
      stopped: number;
      stopTime: number | null;
    }

    export interface Timetable {
      timetableId: number;
      category: string;
      route: string;

      stopList: TimetableStop[];

      TWR: boolean;
      SKR: boolean;
      sceneries: string[];
      path: string;
    }
  }
}
