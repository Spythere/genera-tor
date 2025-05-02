<template>
  <div class="order-train-picker">
    <div class="options">
      <div class="options-top">
        <select
          name="dispatcher-select"
          id="dispatcher-select"
          v-model="selectedSceneryId"
          @change="selectOption"
        >
          <option :value="null" disabled>Sceneria</option>
          <option
            v-for="scenery in filteredSceneries"
            :value="`${scenery.stationName}|${scenery.stationHash}|${scenery.dispatcherName}|${scenery.region}`"
            :key="scenery.dispatcherName + scenery.stationName"
          >
            {{ scenery.stationName }} &bull; {{ scenery.dispatcherName }}
          </option>
        </select>

        <select
          name="region-select"
          id="region-select"
          v-model="selectedRegion"
          @change="selectOption"
        >
          <option :value="null" disabled>Region</option>
          <option v-for="region in regions" :value="region" :key="region">
            {{ getRegionNameById(region) }}
          </option>
          <!-- <option
                v-for="scenery in filteredSceneries"
                :value="`${scenery.stationName}|${scenery.stationHash}|${scenery.dispatcherName}|${scenery.region}`"
                :key="scenery.dispatcherName + scenery.stationName"
              >
                
              </option> -->
        </select>
      </div>

      <select
        name="checkpoint-select"
        id="checkpoint-select"
        v-model="selectedCheckpointName"
        :disabled="!selectedScenery"
      >
        <option :value="null" disabled>Posterunek</option>
        <option :value="cp" v-for="cp in checkpointNameList" :key="cp">
          {{ cp }}
        </option>
      </select>

      <label for="fill-checkpoint" class="g-checkbox">
        <input
          type="checkbox"
          name="fill-checkpoint"
          id="fill-checkpoint"
          v-model="fillCheckpointName"
        />
        <span> Uzupełniaj skrót wybranego posterunku</span>
      </label>
    </div>

    <div class="content">
      <b v-if="!selectedSceneryId" class="text--accent">
        Wybierz dyżurnego oraz scenerię, aby zobaczyć pociągi
      </b>

      <div v-else>
        <div style="margin-bottom: 0.5em">
          <h3 style="margin-bottom: 0.5em">Aktywne RJ i gracze na scenerii</h3>
          <b class="text--accent">Kliknij na gracza, aby wypełnić obecny rozkaz jego danymi</b>
        </div>

        <ul class="train-list">
          <li
            v-for="train in sceneryTrains"
            :key="train.trainNo + train.driverName"
            @click="fillOrder(train.trainNo)"
          >
            <button class="g-button">
              <span
                v-if="train.currentStationName == selectedScenery?.stationName"
                class="online-indicator"
              ></span>

              <b>
                {{ train.driverName }} &bull;
                <span v-if="train.timetable" style="color: gold">{{
                  train.timetable.category
                }}</span>
                {{ train.trainNo }}
              </b>
            </button>
          </li>

          <li class="no-trains" v-if="sceneryTrains?.length == 0 && selectedSceneryId">
            Brak graczy
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
import { getRegionNameById } from '../utils/sceneryUtils';

export default defineComponent({
  name: 'order-train-picker',

  data() {
    return {
      sceneriesData: undefined as ISceneryData[] | undefined,
      activeData: undefined as API.ActiveData.Response | undefined,

      selectedSceneryId: null as string | null,
      selectedCheckpointName: null as string | null,
      selectedRegion: 'eu',

      fillCheckpointName: false,

      refreshInterval: -1,
      store: useStore(),

      regions: ['eu', 'cae', 'usw', 'us', 'ru']
    };
  },

  created() {
    this.fillCheckpointName = window.localStorage.getItem('fill-checkpoint') == 'true';

    this.fetchSceneriesData();
  },

  async activated() {
    await this.fetchActiveData();
    this.handleQueries();

    this.refreshInterval = window.setInterval(() => {
      this.fetchActiveData();
    }, 25 * 1000);
  },

  deactivated() {
    window.clearInterval(this.refreshInterval);
  },

  watch: {
    fillCheckpointName(val: boolean) {
      window.localStorage.setItem('fill-checkpoint', `${val}`);
    }
  },

  computed: {
    selectedScenery() {
      return this.activeData?.activeSceneries?.find(
        (scenery) =>
          this.selectedSceneryId ==
            `${scenery.stationName}|${scenery.stationHash}|${scenery.dispatcherName}|${scenery.region}` &&
          this.selectedRegion == scenery.region
      );
    },

    filteredSceneries() {
      return this.activeData?.activeSceneries
        ?.filter((s) => s.isOnline && s.region == this.selectedRegion)
        .sort((s1, s2) => s1.stationName.localeCompare(s2.stationName));
    },

    checkpointNameList() {
      if (!this.selectedScenery) return [];

      const checkpoints =
        this.sceneriesData?.find((s) => s.name == this.selectedScenery?.stationName)?.checkpoints ??
        '';

      if (checkpoints.length == 0) return [this.selectedScenery.stationName];

      return checkpoints.split(';');
    },

    sceneryTrains() {
      if (!this.selectedScenery || !this.activeData?.trains) return [];

      const scenery = this.selectedScenery;

      return this.activeData.trains
        ?.filter(
          (t) =>
            (t.currentStationName == scenery.stationName &&
              t.region == scenery.region &&
              (t.online || t.lastSeen >= Date.now() - 60000)) ||
            t.timetable?.path.includes(`${scenery.stationName} ${scenery.stationHash}.sc`)
        )
        .sort((t1, t2) => {
          return (
            (t2.currentStationName == scenery.stationName ? 1 : -1) -
              (t1.currentStationName == scenery.stationName ? 1 : -1) ||
            t1.driverName.localeCompare(t2.driverName)
          );
        });
    }
  },

  methods: {
    getRegionNameById,

    async fetchSceneriesData() {
      const data: ISceneryData[] = (await http.get<ISceneryData[]>('api/getSceneries')).data;

      this.sceneriesData = data;
    },

    async fetchActiveData() {
      const data: API.ActiveData.Response = await (await http.get('api/getActiveData')).data;

      this.activeData = data;
    },

    selectOption() {
      this.selectedCheckpointName =
        this.checkpointNameList.length == 0 ? null : this.checkpointNameList[0];
    },

    fillOrder(trainNo: number) {
      if (!this.selectedScenery) return;

      const chosenOrder = this.store[this.store.chosenOrderType];
      chosenOrder.header.trainNo = trainNo.toString();
      chosenOrder.header.date = currentFormattedDate();

      this.store.orderFooter.dispatcherName = this.selectedScenery.stationName;
      this.store.orderFooter.stationName =
        this.selectedCheckpointName?.split(',')[0] || this.selectedScenery.stationName;
      this.store.orderFooter.hour = currentFormattedHours();
      this.store.orderFooter.minutes = currentFormattedMinutes();

      if (this.fillCheckpointName) {
        const sceneryAbbrev = this.sceneriesData?.find(
          ({ name }) => name === this.selectedSceneryId
        )?.abbr;
        this.store.orderFooter.checkpointName =
          sceneryAbbrev || this.store.orderFooter.stationName.slice(0, 2);
      }

      this.store.orderMode = 'OrderMessage';
    },

    handleQueries() {
      const query = new URLSearchParams(window.location.search);

      const id = query.get('sceneryId');

      if (id) {
        const [sceneryName, sceneryRegion] = id.split('|');

        this.selectedRegion = sceneryRegion;

        const queryScenery = this.activeData?.activeSceneries?.find(
          (sc) => sc.stationName == sceneryName && sc.region == sceneryRegion && sc.isOnline
        );

        if (queryScenery) {
          this.selectedSceneryId = `${queryScenery.stationName}|${queryScenery.stationHash}|${queryScenery.dispatcherName}|${queryScenery.region}`;

          console.log(this.selectedRegion);
          this.selectOption();

          this.store.orderMode = 'OrderTrainPicker';
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@use '../styles/colors';

.order-train-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 0 0.5em;
}

.options {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 0.5em;

  select {
    background-color: colors.$bgColDarker;

    font-size: 1em;
    width: 100%;

    &[disabled] {
      color: gray;
    }
  }
}

.options-top {
  display: grid;
  grid-template-columns: 3fr auto;
  gap: 0.5em;
  width: 100%;
}

.content {
  margin-top: 1em;
  width: 100%;
  text-align: center;
}

ul.train-list {
  padding: 1px;

  li.no-trains {
    font-weight: bold;
    background-color: colors.$bgColDarker;
    padding: 0.5em;
    margin-top: 0.5em;
  }

  li > button {
    width: 100%;
    background-color: colors.$bgColDarker;
    padding: 0.5em;
    margin-top: 0.5em;

    &:hover {
      background-color: colors.$bgColLighter;
    }

    &:focus-visible {
      outline: 1px solid colors.$accentCol;
    }
  }
}

.online-indicator {
  display: inline-block;
  width: 9px;
  height: 9px;
  vertical-align: middle;
  background-color: greenyellow;
  border-radius: 100%;
  margin: 0 5px;
}
</style>
