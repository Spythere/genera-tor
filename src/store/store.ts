import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
  state: () => {
    return {
      chosenOrderType: 'OrderN',

      orderFooter: {
        stationName: '',
        checkpointName: '',
        hour: '',
        minutes: '',
        dispatcherName: '',
        secondaryDispatcherName: '',
      },

      orderMessage: '',
      footerMessage: '',

      orderN: {
        header: {
          orderNo: '1',
          trainNo: '',
          date: new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: 'long' }),
        },

        row1: {
          enabled: false,
          from: '',
          to: '',
          trackNo: '',
          trackNo2: '',
        },

        row2: {
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

        row3: {
          enabled: false,
          option1: 'Jazda',
          option2: 'pociąg',

          direction: '',
          toKilometer: '',
          trackNo: '',
          untilHour: '',
          untilMin: '',
        },

        row4: {
          enabled: false,
          trackNo: '',
          optionStation: 'stację',
          stationName: '',
          checkbox: 'checkbox-4a',
          side: 'lewej',
        },

        row5: {
          enabled: false,
          trackNo: '',
          direction: '',
          stationType: 'stację',
          stationName: '',
          on: '',
        },
      },

      orderS: {
        chosenRows: [1],

        header: {
          orderNo: '1',
          trainNo: '',
          for: 'pociągu',
          date: new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: 'long' }),
        },

        row1: {
          enabled: false,
          option1: 'sygnału "nakaz jazdy"',
          optionSignal: 'wyjazdowego',
          radio1: 'radio-1a-1',
          signal1: '',
          trackNo: '',
        },

        row2: {
          enabled: false,
          signalType: 'wyjazdowego',
          signal1: '',
          signal2: '',
          signal3: '',
          trackNo: '',
        },

        row3: {
          enabled: false,
          from: '',
          to: '',
          trackNo: '',
          trainNo: '',
          arrivedTo: '',
          hour: '',
        },

        row4: {
          enabled: false,
          content: '',
        },
      },
    };
  },
});





