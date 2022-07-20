import { defineComponent } from 'vue';
import { useStore } from '../store/store';

export default defineComponent({
  setup() {
    return {
      store: useStore(),
    };
  },

  methods: {
    generateFooter() {
      const footer = this.store.orderFooter;

      this.store.footerMessage = ' <b>|</b> ';
      if (footer.stationName) this.store.footerMessage += ` Stacja: ${footer.stationName}`;
      if (footer.checkpointName) this.store.footerMessage += ` Posterunek: ${footer.checkpointName}`;
      if (footer.hour) this.store.footerMessage += `, godz. ${footer.hour}`;
      if (footer.minutes) this.store.footerMessage += ` min. ${footer.minutes}`;
      if (footer.dispatcherName) this.store.footerMessage += `, dyżurny ruchu ${footer.dispatcherName}`;
      if (footer.secondaryDispatcherName)
        this.store.footerMessage += `, z polecenia dyżurnego ruchu ${footer.secondaryDispatcherName}`;
    },
  },
});
