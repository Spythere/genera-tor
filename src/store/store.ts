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
            },
            optionalFieldNames: ['signalbox2']
          },
          {
            key: '2155',
            name: '21.55',
            active: false,
            inputFields: {
              signalbox1: '',
              signalbox2: '',
              signal1: ''
            },
            optionalFieldNames: ['signalbox2']
          },
          {
            key: '2160',
            name: '21.60',
            active: false,
            inputFields: {
              signalbox1: '',
              signalbox2: '',
              signalbox3: '',
              line1: '',
              vmax1: ''
            }
          },
          {
            key: '2165',
            name: '21.65',
            active: false,
            inputFields: {
              km1: '',
              km2: ''
            }
          },
          {
            key: '2170',
            name: '21.70',
            active: false,
            inputFields: {
              signalbox1: '',
              signalbox2: '',
              line1: ''
            }
          },
          {
            key: '2180',
            name: '21.80',
            active: false,
            inputFields: {
              track1: '',
              signalbox1: '',
              km1: '',
              signalbox2: '',
              hour1: ''
            }
          },
          {
            key: '2181',
            name: '21.81',
            active: false,
            inputFields: {}
          },
          {
            key: '2182',
            name: '21.82',
            active: false,
            inputFields: {
              train1: '',
              km1: ''
            }
          },
          {
            key: '2183',
            name: '21.83',
            active: false,
            inputFields: {
              train1: '',
              km1: ''
            }
          },
          {
            key: '2185',
            name: '21.85',
            active: false,
            inputFields: {
              track1: '',
              km1: '',
              signalbox1: '',
              signalbox2: ''
            }
          },
          {
            key: '2310',
            name: '23.10',
            active: false,
            inputFields: {},
            listFields: [
              {
                signalbox1: '',
                signalbox2: '',
                track1: '',
                vmax1: '',
                km1: '',
                km2: '',
                other1: ''
              },
              {
                signalbox1: '',
                signalbox2: '',
                track1: '',
                vmax1: '',
                km1: '',
                km2: '',
                other1: ''
              },
              {
                signalbox1: '',
                signalbox2: '',
                track1: '',
                vmax1: '',
                km1: '',
                km2: '',
                other1: ''
              }
            ]
          },
          {
            key: '2311',
            name: '23.11',
            active: false,
            inputFields: {}
          },
          {
            key: '2320',
            name: '23.20',
            active: false,
            inputFields: {
              other2320: ''
            }
          }
        ],
        customInstructions: {
          '2310': {
            name: '23.10',
            active: false,

            inputFields: {},
            optionalFieldNames: []
          }
        }
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
