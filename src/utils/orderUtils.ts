import { IOrderData } from '../types/orderTypes';

export const getOrderFullId = (footerData: IOrderData['footer']) => {
  return `RD-${footerData.orderNo}-${footerData.sceneryId}-${footerData.orderYear}`;
};

export const handleOrderPlaceholders = (isRowEnabled: boolean, rowRef: HTMLTableElement) => {
  rowRef.querySelectorAll('input[type="text"]').forEach((node) => {
    if (!isRowEnabled) {
      if (node.getAttribute('placeholder') != null) {
        node.setAttribute('holder', node.getAttribute('placeholder')!);
        node.removeAttribute('placeholder');
      }

      return;
    }

    if (!node.getAttribute('holder')) return;
    const radioCheckedAttr = node.getAttribute('radio-checked');

    if (radioCheckedAttr == null)
      return node.setAttribute('placeholder', node.getAttribute('holder')!);
    if (radioCheckedAttr == 'true')
      return node.setAttribute('placeholder', node.getAttribute('holder')!);
    if (node.getAttribute('placeholder') == null) return;

    node.setAttribute('holder', node.getAttribute('placeholder')!);
    node.removeAttribute('placeholder');
  });
};

export function createOrderDataObject(): IOrderData {
  return {
    header: {
      A: '',
      AType: 'train',
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
        optionalFieldNames: [],
        textDirectives: []
      },
      {
        key: '99',
        name: '99',
        active: false,
        inputFields: {
          x1: ''
        },
        optionalFieldNames: [],
        textDirectives: []
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
        optionalFieldNames: ['signal1', 'signal2', 'signal3'],
        textDirectives: ['bold1', 'br']
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
        optionalFieldNames: ['signal1', 'signal2', 'signal3'],
        textDirectives: ['bold1', 'br']
      },
      {
        key: '2120',
        name: '21.20',
        active: false,
        inputFields: {
          signalbox1: '',
          signalbox2: '',
          track1: ''
        },
        optionalFieldNames: [],
        textDirectives: ['highlight1', 'highlight2', 'underline1', 'br']
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
        },
        optionalFieldNames: [],
        textDirectives: []
      },
      {
        key: '2135',
        name: '21.35',
        active: false,
        inputFields: {
          track1: '',
          signalbox1: ''
        },
        optionalFieldNames: [],
        textDirectives: ['bold1']
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
        optionalFieldNames: ['signalbox2', 'km1'],
        textDirectives: ['bold1']
      },
      {
        key: '2145',
        name: '21.45',
        active: false,
        inputFields: {
          signalbox1: '',
          signal1: ''
        },
        optionalFieldNames: [],
        textDirectives: ['bold1', 'br']
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
        optionalFieldNames: ['signalbox2'],
        textDirectives: ['bold1', 'br', 'bold2']
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
        optionalFieldNames: ['signalbox2'],
        textDirectives: ['bold1']
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
        },
        optionalFieldNames: [],
        textDirectives: ['bold1']
      },
      {
        key: '2165',
        name: '21.65',
        active: false,
        inputFields: {
          km1: '',
          km2: ''
        },
        optionalFieldNames: [],
        textDirectives: ['bold1']
      },
      {
        key: '2170',
        name: '21.70',
        active: false,
        inputFields: {
          signalbox1: '',
          signalbox2: '',
          line1: ''
        },
        optionalFieldNames: [],
        textDirectives: ['bold1', 'br', 'bold2']
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
        },
        optionalFieldNames: [],
        textDirectives: ['bold1']
      },
      {
        key: '2181',
        name: '21.81',
        active: false,
        inputFields: {},
        optionalFieldNames: [],
        textDirectives: ['bold1']
      },
      {
        key: '2182',
        name: '21.82',
        active: false,
        inputFields: {
          train1: '',
          km1: ''
        },
        optionalFieldNames: [],
        textDirectives: ['bold1']
      },
      {
        key: '2183',
        name: '21.83',
        active: false,
        inputFields: {
          train1: '',
          km1: ''
        },
        optionalFieldNames: [],
        textDirectives: ['bold1']
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
        },
        optionalFieldNames: [],
        textDirectives: ['bold1']
      },
      {
        key: '2310',
        name: '23.10',
        active: false,
        inputFields: {},
        listFields: [
          {
            active: false,
            values: {
              signalbox1: '',
              signalbox2: '',
              track1: '',
              vmax1: '',
              km1: '',
              km2: '',
              other1: ''
            },
            optionalFieldNames: ['signalbox2']
          },
          {
            active: false,
            values: {
              signalbox1: '',
              signalbox2: '',
              track1: '',
              vmax1: '',
              km1: '',
              km2: '',
              other1: ''
            },
            optionalFieldNames: ['signalbox2']
          },
          {
            active: false,
            values: {
              signalbox1: '',
              signalbox2: '',
              track1: '',
              vmax1: '',
              km1: '',
              km2: '',
              other1: ''
            },
            optionalFieldNames: ['signalbox2']
          }
        ],
        optionalFieldNames: [],
        textDirectives: ['bold1', 'br']
      },
      {
        key: '2311',
        name: '23.11',
        active: false,
        inputFields: {},
        optionalFieldNames: [],
        textDirectives: ['bold1']
      },
      {
        key: '2320',
        name: '23.20',
        active: false,
        inputFields: {
          other2320: ''
        },
        optionalFieldNames: [],
        textDirectives: []
      }
    ],
    footer: {
      V: '',
      W: '',
      Y: '',
      sceneryId: '',
      orderNo: 0,
      orderYear: 26
    }
  };
}
