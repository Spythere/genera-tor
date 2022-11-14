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
      <b v-if="!selectedSceneryName" class="text--accent"> Wybierz dyżurnego oraz scenerię, aby zobaczyć pociągi </b>

      <div v-else>
        <b class="text--accent">Kliknij na gracza, aby wypełnić obecny rozkaz jego danymi</b>

        <p>Gracze bez rozkładu jazdy</p>
        <ul class="train-list">
          <li v-for="train in sceneryTrains">
            <b>{{ train.trainNo }} | {{ train.driverName }}</b>
          </li>

          <li class="no-trains" v-if="sceneryTrains.length == 0 && selectedSceneryName">Brak graczy na scenerii</li>
        </ul>

        <p>Aktywne rozkłady jazdy</p>
        <ul class="train-list">
          <li v-for="train in sceneryScheduledTrains">
            <b>{{ train.trainNo }} | {{ train.driverName }}</b>
          </li>

          <li class="no-trains" v-if="sceneryScheduledTrains.length == 0">Brak aktywnych rozkładów</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { ApiSWDR, ApiStacjownik } from '../types/apiTypes';
import { ISceneryData } from '../types/dataTypes';

export default defineComponent({
  name: 'order-train-picker',
  data() {
    return {
      sceneriesOnline: [] as ISceneryData[],
      trainsOnline: [] as ApiStacjownik.IActiveTrain[],

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
    selectedSceneryHash() {
      return this.sceneriesOnline.find((s) => this.selectedSceneryName == s.stationName)?.stationHash;
    },

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
      return this.trainsOnline.filter(
        (t) => t.online && t.currentStationName == this.selectedSceneryName && this.selectedSceneryName && !t.timetable
      );
    },

    sceneryScheduledTrains() {
      if (!this.selectedSceneryHash) return [];
      const hash = this.selectedSceneryHash;

      return this.trainsOnline
        .filter((t) => t.timetable?.sceneries.includes(hash))
        .sort((t1, t2) => t1.trainNo - t2.trainNo);
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
      const data: ApiStacjownik.IActiveTrain[] = await (
        await axios.get(`${import.meta.env['VITE_APP_API_URL']}/getActiveTrainList`)
      ).data;

      if (!data) return;

      this.trainsOnline = data;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../styles/global.scss';

.order-train-picker {
  padding: 1em;
  height: 90vh;

  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 1em;
}

.options {
  display: flex;
  width: 100%;
  gap: 1em;

  select {
    border: 2px solid white;
    color: white;
    font-size: 1em;
    width: 100%;
    margin: 0;
    padding: 0.15em;
  }

  option {
    color: black;
  }
}

.content {
  margin-top: 1em;
  width: 100%;
  text-align: center;

  p {
    margin: 1em 0;
    font-weight: bold;
    font-size: 1.1em;
  }
}

ul.train-list {
  li {
    background-color: #111;
    padding: 0.5em;
    margin-top: 0.5em;

    cursor: pointer;

    &.no-trains {
      font-weight: bold;
      background-color: #222;

      cursor: default;
    }
  }
}
</style>

