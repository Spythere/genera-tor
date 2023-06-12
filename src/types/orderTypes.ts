export type TOrder = 'orderO' | 'orderS' | 'orderN';

export interface LocalStorageOrder {
  id: string;
  orderType: TOrder;
  orderBody: any;
  orderFooter: any;
  createdAt?: number;
  updatedAt?: number;
}

export interface IOrderN {
  header: {
    orderNo: string;
    trainNo: string;
    date: string;
  };

  rows: [
    {
      enabled: boolean;
      from: string;
      to: string;
      trackNo: string;
      trackNo2: string;
    },
    {
      enabled: boolean;
      option1: string;
      option2: string;
      option3: string;
      signal1: string;
      signal2: string;
      signal3: string;
      signalType: string;
      checkbox: string;
      direction1: string;
      direction2: string;
      trackNoFrom: string;
      trackNoTo1: string;
      trackNoTo2: string;
    },
    {
      enabled: boolean;
      option1: string;
      option2: string;

      direction: string;
      toKilometer: string;
      trackNo: string;
      untilHour: string;
      untilMin: string;
    },
    {
      enabled: boolean;
      trackNo: string;
      optionStation: string;
      stationName: string;
      checkbox: string;
      side: string;
    },
    {
      enabled: boolean;
      trackNo: string;
      direction: string;
      stationType: string;
      stationName: string;
      on: string;
    }
  ];
}

export interface IOrderS {
  header: {
    orderNo: string;
    trainNo: string;
    for: string;
    date: string;
  };

  rows: [
    {
      enabled: boolean;
      option1: string;
      optionSignal: string;
      radio1: string;
      signal1: string;
      trackNo: string;
    },
    {
      enabled: boolean;
      signalType: string;
      signal1: string;
      signal2: string;
      signal3: string;
      trackNo: string;
    },
    {
      enabled: boolean;
      from: string;
      to: string;
      trackNo: string;
      trainNo: string;
      arrivedTo: string;
      hour: string;
    },
    {
      enabled: boolean;
      content: string;

      w5: {
        enabled: boolean;
        trackNo: string;
        maxKm: string;
        returnWay: string;
        maxHour: string;
        tmName: string;
      };
    }
  ];
}

export interface IOrderO {
  header: {
    orderNo: string;
    trainNo: string;
    date: string;
  };

  orderList: [
    {
      name: string;
      from: string;
      to: string;
      vmax: string;
      jo: boolean;
      reason: string;
    },
    {
      name: string;
      from: string;
      to: string;
      vmax: string;
      jo: boolean;
      reason: string;
    },
    {
      name: string;
      from: string;
      to: string;
      vmax: string;
      jo: boolean;
      reason: string;
    },
    {
      name: string;
      from: string;
      to: string;
      vmax: string;
      jo: boolean;
      reason: string;
    },
    {
      name: string;
      from: string;
      to: string;
      vmax: string;
      jo: boolean;
      reason: string;
    }
  ];

  other: string;
}

