import { defineStore } from 'pinia';

import StorageManager from '../managers/storageManager';
import i18n from '../i18n';
import { createOrderDataObject } from '../utils/orderUtils';
import { TPanel } from '../types/orderTypes';

export const useStore = defineStore('store', {
  state: () => {
    return {
      currentAppLocale: 'pl',

      appUpdateData: {
        version: '',
        changelog: '',
        releaseURL: ''
      },

      isMigrationInfoOpen: false,
      updateCardOpen: false,
      helperModalOpen: false,
      orderDarkMode: false,

      panelMode: 'OrderMessagePanel' as TPanel,

      chosenLocalOrderId: '',

      orderData: createOrderDataObject(),

      orderMessage: ''
    };
  },
  actions: {
    changeLang(lang: string) {
      i18n.global.locale.value = lang as typeof i18n.global.locale.value;
      this.currentAppLocale = lang;

      StorageManager.setStringValue('lang', lang);
    }
  }
});
