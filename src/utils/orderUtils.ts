import { IOrderN, IOrderO, IOrderS, TOrder } from '../types/orderTypes';
import { currentFormattedDate } from './dateUtils';

const orderDefaults = {
  orderN: {
    header: {
      orderNo: '1',
      trainNo: '',
      date: ''
    },

    rows: [
      {
        enabled: false,
        from: '',
        to: '',
        trackNo: '',
        trackNo2: ''
      },
      {
        enabled: false,
        option1: 'sygnału "Nakaz Jazdy"',
        option2: 'lewy',
        option3: 'lewy',
        signal1: '',
        signal2: '',
        signal3: '',
        signalType: 'wyjazdowego',
        checkbox: 'checkbox-2a',
        direction1: '',
        direction2: '',
        trackNoFrom: '',
        trackNoTo1: '',
        trackNoTo2: ''
      },
      {
        enabled: false,
        option1: 'Jazda',
        option2: 'pociąg',

        direction: '',
        toKilometer: '',
        trackNo: '',
        untilHour: '',
        untilMin: ''
      },
      {
        enabled: false,
        trackNo: '',
        optionStation: 'stację',
        stationName: '',
        checkbox: 'checkbox-4a',
        side: 'lewej'
      },
      {
        enabled: false,
        trackNo: '',
        direction: '',
        stationType: 'stację',
        stationName: '',
        on: ''
      },
      {
        enabled: false,
        content: '',
        twoWay: {
          enabled: false,
          from: '',
          to: '',
          trackNo: ''
        }
      }
    ]
  },

  orderS: {
    header: {
      orderNo: '1',
      trainNo: '',
      for: 'pociągu',
      date: ''
    },

    rows: [
      {
        enabled: false,
        option1: 'sygnału "nakaz jazdy"',
        optionSignal: 'wyjazdowego',
        radio1: 'radio-1a-1',
        signal1: '',
        trackNo: ''
      },

      {
        enabled: false,
        signalType: 'wyjazdowego',
        signal1: '',
        signal2: '',
        signal3: '',
        trackNo: ''
      },

      {
        enabled: false,
        from: '',
        to: '',
        trackNo: '',
        trainNo: '',
        arrivedTo: '',
        hour: ''
      },

      {
        enabled: false,
        content: '',
        w5: {
          enabled: false,
          maxHour: '',
          borderType: 'wskaźnik przetaczania W5',
          tmName: '',
          maxKm: '',
          returnWay: 'sygnał ręczny "Do mnie"',
          trackNo: ''
        }
      }
    ]
  },

  orderO: {
    header: {
      orderNo: '1',
      trainNo: '',
      date: ''
    },

    orderList: [
      {
        name: '',
        from: '',
        to: '',
        vmax: '',
        jo: false,
        reason: ''
      },
      {
        name: '',
        from: '',
        to: '',
        vmax: '',
        jo: false,
        reason: ''
      },
      {
        name: '',
        from: '',
        to: '',
        vmax: '',
        jo: false,
        reason: ''
      },
      {
        name: '',
        from: '',
        to: '',
        vmax: '',
        jo: false,
        reason: ''
      },
      {
        name: '',
        from: '',
        to: '',
        vmax: '',
        jo: false,
        reason: ''
      }
    ],
    other: ''
  }
};

export function getOrderType(order: IOrderN | IOrderO | IOrderS): TOrder {
  if ('rows' in order && 'for' in order.header) return 'orderS';
  else if ('rows' in order) return 'orderN';

  return 'orderO';
}

export function setOrderToDefault(order: IOrderN | IOrderO | IOrderS) {
  const orderType = getOrderType(order);
  const defaultOrderObjectCopy = JSON.parse(JSON.stringify(orderDefaults[orderType]));

  Object.assign(order, defaultOrderObjectCopy);

  // Update date in the header
  order.header.date = currentFormattedDate();
}
