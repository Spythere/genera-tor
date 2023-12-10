<template>
  <div class="order-train-picker">
    <div class="options">
      <label for="dispatcher-select">
        <select name="dispatcher-select" id="dispatcher-select" v-model="selectedDispatcherName">
          <option :value="null" disabled>Nick dyżurnego</option>
          <option
            v-for="dispatcherName in dispatcherNameList"
            :value="dispatcherName"
            :key="dispatcherName"
          >
            {{ dispatcherName }}
          </option>
        </select>
      </label>

      <label for="scenery-select">
        <select
          name="scenery-select"
          id="scenery-select"
          v-model="selectedSceneryName"
          :disabled="!sceneryNameList || sceneryNameList.length == 0"
        >
          <option :value="null" disabled>Sceneria</option>
          <option :value="sceneryName" v-for="sceneryName in sceneryNameList" :key="sceneryName">
            {{ sceneryName }}
          </option>
        </select>
      </label>

      <label for="checkpoint-select">
        <select
          name="checkpoint-select"
          id="checkpoint-select"
          v-model="selectedCheckpointName"
          :disabled="!sceneryNameList || sceneryNameList.length == 0"
        >
          <option :value="null" disabled>Posterunek</option>
          <option :value="cp" v-for="cp in checkpointNameList" :key="cp">
            {{ cp }}
          </option>
        </select>
      </label>

      <label for="fill-checkpoint" class="g-checkbox">
        <input
          type="checkbox"
          name="fill-checkpoint"
          id="fill-checkpoint"
          v-model="fillCheckpointName"
        />
        <span> Uzupełniaj skrót post.</span>
      </label>
    </div>

    <div class="content">
      <b v-if="!selectedSceneryName" class="text--accent">
        Wybierz dyżurnego oraz scenerię, aby zobaczyć pociągi
      </b>

      <div v-else>
        <b class="text--accent">Kliknij na gracza, aby wypełnić obecny rozkaz jego danymi</b>

        <p>Gracze online bez RJ</p>
        <ul class="train-list">
          <li
            v-for="train in sceneryTrains"
            :key="train.trainNo + train.driverName"
            @click="fillOrder(train.trainNo)"
          >
            <b>{{ train.trainNo }} | {{ train.driverName }}</b>
          </li>

          <li class="no-trains" v-if="sceneryTrains?.length == 0 && selectedSceneryName">
            Brak graczy
          </li>
        </ul>

        <p>Aktywne rozkłady jazdy</p>
        <ul class="train-list">
          <li
            v-for="train in sceneryScheduledTrains"
            :key="train.trainNo + train.driverName"
            @click="fillOrder(train.trainNo)"
          >
            <b>{{ train.trainNo }} | {{ train.driverName }}</b>
          </li>

          <li class="no-trains" v-if="sceneryScheduledTrains?.length == 0">
            Brak aktywnych rozkładów
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '../store/store';
import {
  currentFormattedDate,
  currentFormattedHours,
  currentFormattedMinutes
} from '../utils/dateUtils';
import http from '../http';
import { ISceneryData } from '../types/dataTypes';
import { API } from '../types/apiTypes';

export default defineComponent({
  name: 'order-train-picker',

  data() {
    return {
      sceneriesData: undefined as ISceneryData[] | undefined,
      activeData: undefined as API.ActiveData.Response | undefined,

      selectedSceneryName: null as string | null,
      selectedDispatcherName: null as string | null,
      selectedCheckpointName: null as string | null,

      fillCheckpointName: false,

      refreshInterval: -1,
      store: useStore()
    };
  },

  created() {
    this.fillCheckpointName = window.localStorage.getItem('fill-checkpoint') == 'true';

    this.fetchSceneriesData();
  },

  activated() {
    this.fetchActiveData();

    this.refreshInterval = window.setInterval(() => {
      this.fetchActiveData();
    }, 35 * 1000);
  },

  deactivated() {
    window.clearInterval(this.refreshInterval);
  },

  watch: {
    selectedDispatcherName() {
      if (!this.sceneryNameList) return null;

      this.selectedSceneryName = this.sceneryNameList.length == 0 ? null : this.sceneryNameList[0];
    },

    selectedSceneryName() {
      this.selectedCheckpointName =
        this.checkpointNameList.length == 0 ? null : this.checkpointNameList[0];
    },

    fillCheckpointName(val: boolean) {
      window.localStorage.setItem('fill-checkpoint', `${val}`);
    }
  },

  computed: {
    selectedSceneryHash() {
      return this.activeData?.activeSceneries?.find(
        (s) => this.selectedSceneryName == s.stationName
      )?.stationHash;
    },

    sceneriesOnlinePL1() {
      return this.activeData?.activeSceneries?.filter((s) => s.region == 'eu' && s.isOnline);
    },

    dispatcherNameList() {
      return [...new Set(this.sceneriesOnlinePL1?.map((s) => s.dispatcherName))].sort((a, b) =>
        a.toLocaleLowerCase() < b.toLocaleLowerCase() ? -1 : 1
      );
    },

    sceneryNameList() {
      if (!this.sceneriesOnlinePL1) return [];

      return this.sceneriesOnlinePL1
        .filter((s) => s.dispatcherName == this.selectedDispatcherName)
        .map((s) => s.stationName)
        .sort((a, b) => (a < b ? -1 : 1));
    },

    checkpointNameList() {
      if (!this.selectedSceneryName) return [];

      const name = this.selectedSceneryName;
      const checkpoints = this.sceneriesData?.find(
        (s) => s.name.toLocaleLowerCase() == name.toLocaleLowerCase()
      )?.checkpoints;

      if (!checkpoints || checkpoints.length == 0) return [name];

      return checkpoints.split(';');
    },

    sceneryTrains() {
      return this.activeData?.trains?.filter(
        (t) =>
          t.online &&
          t.currentStationName == this.selectedSceneryName &&
          this.selectedSceneryName &&
          !t.timetable
      );
    },

    sceneryScheduledTrains() {
      if (!this.selectedSceneryHash) return [];
      const hash = this.selectedSceneryHash;

      return this.activeData?.trains
        ?.filter((t) => t.timetable?.sceneries.includes(hash))
        .sort((t1, t2) => t1.trainNo - t2.trainNo);
    }
  },

  methods: {
    async fetchSceneriesData() {
      const data: ISceneryData[] = (await http.get<ISceneryData[]>('api/getSceneries')).data;

      this.sceneriesData = data;
    },

    async fetchActiveData() {
      const data: API.ActiveData.Response = await (await http.get('api/getActiveData')).data;

      this.activeData = data;
    },

    fillOrder(trainNo: number) {
      if (!this.selectedDispatcherName || !this.selectedSceneryName) return;

      const chosenOrder = this.store[this.store.chosenOrderType];
      chosenOrder.header.trainNo = trainNo.toString();
      chosenOrder.header.date = currentFormattedDate();

      this.store.orderFooter.dispatcherName = this.selectedDispatcherName;
      this.store.orderFooter.stationName =
        this.selectedCheckpointName?.split(',')[0] || this.selectedSceneryName;
      this.store.orderFooter.hour = currentFormattedHours();
      this.store.orderFooter.minutes = currentFormattedMinutes();

      if (this.fillCheckpointName) {
        const sceneryAbbrev = this.sceneriesData?.find(
          ({ name }) => name === this.selectedSceneryName
        )?.abbr;
        this.store.orderFooter.checkpointName =
          sceneryAbbrev || this.store.orderFooter.stationName.slice(0, 2);
      }

      this.store.orderMode = 'OrderMessage';
    }
  }
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
