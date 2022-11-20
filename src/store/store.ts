import { defineStore } from 'pinia';
import { IOrderN, IOrderO, IOrderS, TOrder } from '../types/orderTypes';
import { currentFormattedDate, currentFormattedHours, currentFormattedMinutes } from '../utils/dateUtils';

export const useStore = defineStore('store', {
  state: () => {
    return {
      helperModalOpen: false,

      chosenOrderType: 'orderN' as TOrder,
      chosenLocalOrderId: '',

      orderMode: 'OrderMessage',

      orderFooter: {
        stationName: '',
        checkpointName: '',
        hour: currentFormattedHours(),
        minutes: currentFormattedMinutes(),
        dispatcherName: '',
        secondaryDispatcherName: '',
      },

      orderMessage: '',
      footerMessage: '',

      orderO: {
        header: {
          orderNo: '1',
          trainNo: '',
          date: currentFormattedDate(),
        },

        orderList: [
          {
            name: '',
            from: '',
            to: '',
            vmax: '',
            jo: false,
            reason: '',
          },
          {
            name: '',
            from: '',
            to: '',
            vmax: '',
            jo: false,
            reason: '',
          },
          {
            name: '',
            from: '',
            to: '',
            vmax: '',
            jo: false,
            reason: '',
          },
          {
            name: '',
            from: '',
            to: '',
            vmax: '',
            jo: false,
            reason: '',
          },
          {
            name: '',
            from: '',
            to: '',
            vmax: '',
            jo: false,
            reason: '',
          },
        ],
        other: '',
      } as IOrderO,

      orderN: {
        header: {
          orderNo: '1',
          trainNo: '',
          date: currentFormattedDate(),
        },

        rows: [
          {
            enabled: false,
            from: '',
            to: '',
            trackNo: '',
            trackNo2: '',
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
            trackNoTo2: '',
          },
          {
            enabled: false,
            option1: 'Jazda',
            option2: 'pociąg',

            direction: '',
            toKilometer: '',
            trackNo: '',
            untilHour: '',
            untilMin: '',
          },
          {
            enabled: false,
            trackNo: '',
            optionStation: 'stację',
            stationName: '',
            checkbox: 'checkbox-4a',
            side: 'lewej',
          },
          {
            enabled: false,
            trackNo: '',
            direction: '',
            stationType: 'stację',
            stationName: '',
            on: '',
          },
        ],
      } as IOrderN,

      orderS: {
        header: {
          orderNo: '1',
          trainNo: '',
          for: 'pociągu',
          date: currentFormattedDate(),
        },

        rows: [
          {
            enabled: false,
            option1: 'sygnału "nakaz jazdy"',
            optionSignal: 'wyjazdowego',
            radio1: 'radio-1a-1',
            signal1: '',
            trackNo: '',
          },

          {
            enabled: false,
            signalType: 'wyjazdowego',
            signal1: '',
            signal2: '',
            signal3: '',
            trackNo: '',
          },

          {
            enabled: false,
            from: '',
            to: '',
            trackNo: '',
            trainNo: '',
            arrivedTo: '',
            hour: '',
          },

          {
            enabled: false,
            content: '',
          },
        ],
      } as IOrderS,
    };
  },
});

