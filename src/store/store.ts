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

      orderN: {
        header: {
          orderNo: '',
          trainNo: '',
          date: '',
        },

        row1: {
          from: '',
          to: '',
          trackNo: '',
          trackNo2: '',
        },

        row2: {
          option1: 'signal',
          option2: 'lewy',
          option3: 'lewy',
          checkbox: 'checkbox-2a',
        },

        row3: {
          option1: 'jazda',
          option2: 'pociąg',

          direction: '',
          toKilometer: '',
          trackNo: '',
          untilHour: '',
          untilMin: '',
        },

        row4: {
          trackNo: '',
          optionStation: 'stację',
          stationName: '',
          checkbox: 'checkbox-4a',
        },

        row5: {
          trackNo: '',
          direction: '',
          stationOption: 'stację',
          on: '',
        },
      },

      orderS: {
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

