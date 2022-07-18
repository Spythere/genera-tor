import { defineStore } from 'pinia';

export const useStore = defineStore('store', {
  state: () => {
    return {
      orderInfo: {
        stationName: '',
        checkpointName: '',
        hour: '',
        minutes: '',
        dispatcherName: '',
        secondaryDispatcherName: '',
      },

      orderMessage: '',

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
          direction: '',
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
          orderNo: '',
          trainNo: '',
          for: 'pociągu',
          date: '',
        },

        row1: {
          option1: 'sygnału',
          checkbox1a: false,
          checkbox1b: false,
          signal1: '',
          signal2: '',
          trackNo: '',
        },

        row2: {
          signal1: '',
          signal2: '',
          signal3: '',
          trackNo: '',
        },

        row3: {
          from: '',
          to: '',
          trackNo: '',
          trainNo: '',
          arrivedTo: '',
          hour: '',
        },
      },
    };
  },
});


