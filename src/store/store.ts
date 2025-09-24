import { defineStore } from 'pinia';
import { IOrderN, IOrderO, IOrderS, TOrder } from '../types/orderTypes';
import {
  currentFormattedDate,
  currentFormattedHours,
  currentFormattedMinutes
} from '../utils/dateUtils';

export const useStore = defineStore('store', {
  state: () => {
    return {
      currentAppLocale: 'pl',

      appUpdateData: {
        version: '',
        changelog: '',
        releaseURL: ''
      },

      updateCardOpen: false,
      helperModalOpen: false,
      orderDarkMode: false,

      chosenOrderType: 'orderN' as TOrder,
      chosenLocalOrderId: '',

      orderData: {
        header: {
          A: '',
          B: '',
          C: '',
          D: ''
        },
        instructions: [
          {
            key: '22',
            name: '22',
            active: false,
            inputFields: {},
            optionalFieldNames: []
          },
          {
            key: '99',
            name: '99',
            active: false,
            inputFields: {
              x1: ''
            },
            optionalFieldNames: []
          },
          {
            key: '2110',
            name: '21.10',
            active: false,
            inputFields: {
              track1: '',
              signalbox1: '',
              track2: '',
              signalbox2: '',
              signal1: '',
              signal2: '',
              signal3: ''
            },
            optionalFieldNames: ['signal1', 'signal2', 'signal3']
          },
          {
            key: '2115',
            name: '21.15',
            active: false,
            inputFields: {
              track1: '',
              signalbox1: '',
              track2: '',
              signal1: '',
              signal2: '',
              signal3: ''
            },
            optionalFieldNames: ['signal1', 'signal2', 'signal3']
          },
          {
            key: '2120',
            name: '21.20',
            active: false,
            inputFields: {
              track1: '',
              signalbox1: '',
              signalbox2: ''
            }
          },
          {
            key: '2125',
            name: '21.25',
            active: false,
            inputFields: {
              select1: 'select1-a',
              signalbox1: '',
              track1: '',
              km1: '',
              hour1: ''
            },
            selectFields: {
              select1: {
                options: ['select1-a', 'select1-b']
              }
            }
          },
          {
            key: '2135',
            name: '21.35',
            active: false,
            inputFields: {
              track1: '',
              signalbox1: ''
            }
          },
          {
            key: '2140',
            name: '21.40',
            active: false,
            inputFields: {
              signalbox1: '',
              signalbox2: '',
              km1: '',
              other1: ''
            },
            optionalFieldNames: ['signalbox2']
          },
          {
            key: '2145',
            name: '21.45',
            active: false,
            inputFields: {
              signalbox1: '',
              signal1: ''
            }
          },
          {
            key: '2150',
            name: '21.50',
            active: false,
            inputFields: {
              signalbox1: '',
              signalbox2: '',
              km1: ''
            }
          }
        ]
      },

      orderMode: 'OrderMessage',

      orderFooter: {
        stationName: '',
        checkpointName: '',
        hour: currentFormattedHours(),
        minutes: currentFormattedMinutes(),
        dispatcherName: '',
        secondaryDispatcherName: ''
      },

      orderMessage: '',
      footerMessage: '',

      orderO: {
        header: {
          orderNo: '1',
          trainNo: '',
          date: currentFormattedDate()
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
      } as IOrderO,

      orderN: {
        header: {
          orderNo: '1',
          trainNo: '',
          date: currentFormattedDate()
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
      } as IOrderN,

      orderS: {
        header: {
          orderNo: '1',
          trainNo: '',
          for: 'pociągu',
          date: currentFormattedDate()
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
      } as IOrderS
    };
  }
});
