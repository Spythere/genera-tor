import { defineStore } from 'pinia';

import StorageManager from '../managers/storageManager';
import i18n from '../i18n';
import { TPanelMode } from '../types/dataTypes';
import { createOrderDataObject } from '../utils/orderUtils';


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

      panelMode: 'OrderMessagePanel' as TPanelMode,

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
