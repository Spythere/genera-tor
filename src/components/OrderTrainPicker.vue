<template>
  <div class="order-train-picker">
    <div class="options">
      <label for="dispatcher-select">
        <select name="dispatcher-select" id="dispatcher-select" v-model="selectedDispatcherName">
          <option :value="null" disabled>Nick dyżurnego</option>
          <option v-for="dispatcherName in dispatcherNameList" :value="dispatcherName">
            {{ dispatcherName }}
          </option>
        </select>
      </label>

      <label for="scenery-select">
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
      </label>

      <label for="checkpoint-select">
        <select
          name="checkpoint-select"
          id="checkpoint-select"
          v-model="selectedCheckpointName"
          :disabled="sceneryNameList.length == 0"
        >
          <option :value="null" disabled>Posterunek</option>
          <option :value="cp" v-for="cp in checkpointNameList">
            {{ cp }}
          </option>
        </select>
      </label>

      <label for="fill-checkpoint">
        <input type="checkbox" name="fill-checkpoint" id="fill-checkpoint" v-model="fillCheckpointName" />
        Uzupełniaj skrót post.
      </label>
    </div>

    <div class="content">
      <b v-if="!selectedSceneryName" class="text--accent"> Wybierz dyżurnego oraz scenerię, aby zobaczyć pociągi </b>

      <div v-else>
        <b class="text--accent">Kliknij na gracza, aby wypełnić obecny rozkaz jego danymi</b>

        <p>Gracze online bez RJ</p>
        <ul class="train-list">
          <li v-for="train in sceneryTrains" @click="fillOrder(train.trainNo)">
            <b>{{ train.trainNo }} | {{ train.driverName }}</b>
          </li>

          <li class="no-trains" v-if="sceneryTrains.length == 0 && selectedSceneryName">Brak graczy</li>
        </ul>

        <p>Aktywne rozkłady jazdy</p>
        <ul class="train-list">
          <li v-for="train in sceneryScheduledTrains" @click="fillOrder(train.trainNo)">
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
import { useStore } from '../store/store';
import { currentFormattedDate, currentFormattedHours, currentFormattedMinutes } from '../utils/dateUtils';
import { ISceneryOnline, ISceneryData } from '../types/dataTypes';

export default defineComponent({
  name: 'order-train-picker',

  data() {
    return {
      sceneriesData: [] as ISceneryData[],
      sceneriesOnline: [] as ISceneryOnline[],
      trainsOnline: [] as ApiStacjownik.IActiveTrain[],

      selectedSceneryName: null as string | null,
      selectedDispatcherName: null as string | null,
      selectedCheckpointName: null as string | null,

      fillCheckpointName: false,

      refreshInterval: -1,
      store: useStore(),
    };
  },

  created() {
    this.fetchSceneriesData();
  },

  activated() {
    this.fetchOnlineData();

    this.refreshInterval = window.setInterval(() => {
      this.fetchOnlineData();
    }, 35 * 1000);
  },

  deactivated() {
    window.clearInterval(this.refreshInterval);
  },

  watch: {
    selectedDispatcherName() {
      this.selectedSceneryName = this.sceneryNameList.length == 0 ? null : this.sceneryNameList[0];
    },

    selectedSceneryName() {
      this.selectedCheckpointName = this.checkpointNameList.length == 0 ? null : this.checkpointNameList[0];
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
      return [...new Set(this.sceneriesOnlinePL1.map((s) => s.dispatcherName))].sort((a, b) =>
        a.toLocaleLowerCase() < b.toLocaleLowerCase() ? -1 : 1
      );
    },

    sceneryNameList() {
      return this.sceneriesOnlinePL1
        .filter((s) => s.dispatcherName == this.selectedDispatcherName)
        .map((s) => s.stationName)
        .sort((a, b) => (a < b ? -1 : 1));
    },

    checkpointNameList() {
      if (!this.selectedSceneryName) return [];

      const name = this.selectedSceneryName;
      const checkpoints = this.sceneriesData.find(
        (s) => s.name.toLocaleLowerCase() == name.toLocaleLowerCase()
      )?.checkpoints;

      if (!checkpoints || checkpoints.length == 0) return [name];

      return checkpoints.split(';');
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
    async fetchSceneriesData() {
      const data: ISceneryData[] = await (await axios.get(`${import.meta.env['VITE_APP_API_URL']}/getSceneries`)).data;

      if (!data) return;

      this.sceneriesData = data;
    },

    async fetchOnlineData() {
      this.fetchSceneriesOnline();
      this.fetchTrainsOnline();
    },

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

    fillOrder(trainNo: number) {
      if (!this.selectedDispatcherName || !this.selectedSceneryName) return;

      const chosenOrder = this.store[this.store.chosenOrderType];
      chosenOrder.header.trainNo = trainNo.toString();
      chosenOrder.header.date = currentFormattedDate();

      this.store.orderFooter.dispatcherName = this.selectedDispatcherName;
      this.store.orderFooter.stationName = this.selectedCheckpointName?.split(',')[0] || this.selectedSceneryName;
      this.store.orderFooter.hour = currentFormattedHours();
      this.store.orderFooter.minutes = currentFormattedMinutes();

      if (this.fillCheckpointName)
        this.store.orderFooter.checkpointName = this.store.orderFooter.stationName.slice(0, 2);

      this.store.orderMode = 'OrderMessage';
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../styles/global.scss';

.order-train-picker {
  height: 90vh;

  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.options {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 1em;
  flex-wrap: wrap;

  label {
    width: 45%;

    display: flex;
    align-items: center;
  }

  select {
    border: 2px solid white;
    color: white;
    font-size: 1em;
    width: 100%;
    margin: 0;
    padding: 0.15em;

    &[disabled] {
      color: gray;
    }
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

