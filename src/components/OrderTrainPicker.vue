<template>
  <div class="order-train-picker">
    <div class="options">
      <select name="dispatcher-select" id="dispatcher-select" v-model="selectedDispatcherName">
        <option :value="null" disabled>Nick dyżurnego</option>
        <option v-for="dispatcherName in dispatcherNameList" :value="dispatcherName">
          {{ dispatcherName }}
        </option>
      </select>

      <select
        name="scenery-select"
        id="scenery-select"
        v-model="selectedSceneryName"
        :disabled="sceneryNameList.length == 0"
      >
        <option :value="null" disabled>Sceneria</option>
        <option :value="sceneryName" v-for="sceneryName in sceneryNameList">
          {{ sceneryName }}
        </option>
      </select>
    </div>

    <div class="content">
      Wybierz dyżurnego oraz scenerię, aby zobaczyć pociągi

      <ul>
        <li v-for="train in sceneryTrains">
          {{ train.trainNo }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { ApiSWDR } from '../types/apiTypes';
import { ISceneryData, ITrainData } from '../types/dataTypes';

export default defineComponent({
  name: 'order-train-picker',
  data() {
    return {
      sceneriesOnline: [] as ISceneryData[],
      trainsOnline: [] as ITrainData[],

      selectedSceneryName: null as string | null,
      selectedDispatcherName: null as string | null,
    };
  },

  mounted() {
    this.fetchSceneriesOnline();
    this.fetchTrainsOnline();
  },

  watch: {
    selectedDispatcherName() {
      this.selectedSceneryName = this.sceneryNameList.length == 0 ? null : this.sceneryNameList[0];
    },
  },

  computed: {
    sceneriesOnlinePL1() {
      return this.sceneriesOnline.filter((s) => s.region == 'eu' && s.isOnline);
    },

    dispatcherNameList() {
      return [...new Set(this.sceneriesOnlinePL1.map((s) => s.dispatcherName))].sort((a, b) => (a < b ? -1 : 1));
    },

    sceneryNameList() {
      return this.sceneriesOnlinePL1
        .filter((s) => s.dispatcherName == this.selectedDispatcherName)
        .map((s) => s.stationName)
        .sort((a, b) => (a < b ? -1 : 1));
    },

    sceneryTrains() {
      return this.trainsOnline.filter((t) => t.isOnline && t.station?.stationName == this.selectedSceneryName);
    },
  },

  methods: {
    async fetchSceneriesOnline() {
      const data: ApiSWDR.IStationsOnline = await (
        await axios.get(`${import.meta.env['VITE_APP_SWDR_URL']}/?method=getStationsOnline`)
      ).data;

      if (!data.success) return;

      this.sceneriesOnline = data.message;
    },

    async fetchTrainsOnline() {
      const data: ApiSWDR.ITrainsOnline = await (
        await axios.get(`${import.meta.env['VITE_APP_SWDR_URL']}/?method=getTrainsOnline`)
      ).data;

      if (!data.success) return;

      this.trainsOnline = data.message;
    },
  },
});
</script>

<style lang="scss" scoped>
.order-train-picker {
  padding: 1em 0;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.options {
  display: flex;
  width: 100%;

  padding: 0 2em;
}

.content {
  margin-top: 1em;
}

select {
  border: 2px solid white;
  color: white;
  font-size: 1em;
  width: 100%;
}

option {
  color: black;
}
</style>

