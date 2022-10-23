import { defineComponent } from 'vue';
import { useStore } from '../store/store';

export default defineComponent({
  setup() {
    return {
      store: useStore(),
    };
  },

  methods: {
    verifyFooter() {
      const footer = this.store.orderFooter;

      const fieldsToCorrect = [];

      if (!footer.stationName) fieldsToCorrect.push('stacja');
      if (!footer.checkpointName) fieldsToCorrect.push('posterunek');
      if (!footer.hour) fieldsToCorrect.push('godzina');
      if (!footer.minutes) fieldsToCorrect.push('minuta');
      if (!footer.dispatcherName && !footer.secondaryDispatcherName)
        fieldsToCorrect.push('dyżurny ruchu (lub z polecenia dyżurnego ruchu)');

      return fieldsToCorrect;
    },

    generateFooter() {
      const footer = this.store.orderFooter;

      const messageArray = [];

      if (footer.stationName) messageArray.push(`stacja: ${footer.stationName}`);
      if (footer.checkpointName) messageArray.push(`posterunek: ${footer.checkpointName}`);
      if (footer.hour) messageArray.push(`godz. ${footer.hour}`);
      if (footer.minutes) messageArray.push(`min. ${footer.minutes}`);
      if (footer.dispatcherName) messageArray.push(`dyżurny ruchu ${footer.dispatcherName}`);
      if (footer.secondaryDispatcherName)
        messageArray.push(`z polecenia dyżurnego ruchu ${footer.secondaryDispatcherName}`);

      this.store.footerMessage = ` <b>|</b> ${messageArray.join(
        ', '
      )} <b>|</b> Rozkaz otrzymałem, maszynista: (potwierdzić otrzymanie rozkazu)`;
    },
  },
});

