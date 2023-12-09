import { defineComponent } from 'vue';
import { useStore } from '../store/store';

export default defineComponent({
  setup() {
    return {
      store: useStore()
    };
  },

  methods: {
    verifyOrderFields() {
      // const header = this.store[this.store.chosenOrderType].header;
      const footer = this.store.orderFooter;

      const fieldsToCorrect = [];

      // if (!header.orderNo) fieldsToCorrect.push('numer rozkazu');
      // if (!header.trainNo) fieldsToCorrect.push('numer pociągu / manewru');
      // if (!header.date) fieldsToCorrect.push('data');

      if (!footer.stationName) fieldsToCorrect.push('stacja');
      if (!footer.checkpointName) fieldsToCorrect.push('posterunek');
      if (!footer.hour) fieldsToCorrect.push('godzina');
      if (!footer.minutes) fieldsToCorrect.push('minuta');
      if (!footer.dispatcherName && !footer.secondaryDispatcherName)
        fieldsToCorrect.push('dyżurny ruchu (lub z polecenia dyżurnego ruchu)');

      return fieldsToCorrect;
    }
  }
});
