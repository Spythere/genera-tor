<template>
  <div class="order-train-picker">
    <div class="options">
      <div class="options-top">
        <select
          name="dispatcher-select"
          id="dispatcher-select"
          v-model="selectedSceneryId"
          @change="selectCheckpointOption"
        >
          <option :value="null" disabled>
            {{ $t('order-train-picker.placeholder-scenery-name') }}
          </option>
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
          @change="selectCheckpointOption"
        >
          <option :value="null" disabled>
            {{ $t('order-train-picker.placeholder-region-name') }}
          </option>
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
        <option :value="null" disabled>
          {{ $t('order-train-picker.placeholder-checkpoint-name') }}
        </option>
        <option :value="cp" v-for="cp in checkpointNameList" :key="cp">
          {{ cp }}
        </option>
      </select>

      <label for="fill-checkpoint" class="g-checkbox">
        <input
          type="checkbox"
          name="fill-checkpoint"
          id="fill-checkpoint"
          v-model="autofillCheckpointName"
          @change="onAutofillChange()"
        />
        <span> {{ $t('order-train-picker.autofill-checkpoint-id') }}</span>
      </label>
    </div>

    <div class="content">
      <b v-if="!selectedSceneryId" class="text--accent">
        {{ $t('order-train-picker.info') }}
      </b>

      <div v-else>
        <div style="margin-bottom: 0.5em">
          <h3 style="margin-bottom: 0.5em">{{ $t('order-train-picker.title') }}</h3>
          <b class="text--accent">{{ $t('order-train-picker.subtitle') }}</b>
        </div>

        <ul class="train-list">
          <li
            v-for="train in sceneryTrains"
            :key="train.trainNo + train.driverName"
            @click="fillOrderData(train)"
          >
            <button class="g-button">
              <span
                v-if="train.currentStationName == selectedScenery?.stationName"
                class="online-indicator"
              ></span>

              <span>
                {{ train.driverName }} &bull;
                <span v-if="train.timetable" style="color: gold">{{
                  train.timetable.category
                }}</span>
                {{ train.trainNo }}
              </span>
            </button>
          </li>

          <li class="no-trains" v-if="sceneryTrains?.length == 0 && selectedSceneryId">
            {{ $t('order-train-picker.no-trains') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onActivated, onDeactivated, computed } from 'vue';
import http from '../../http';
import { useStore } from '../../store/store';
import { API } from '../../types/apiTypes';
import { ISceneryData } from '../../types/dataTypes';
import StorageManager from '../../managers/storageManager';
import { getRegionNameById } from '../../utils/sceneryUtils';
import { getOrderFullId } from '../../utils/orderUtils';

const store = useStore();
const regions = ['eu', 'cae', 'usw', 'us', 'ru'];
const refreshInterval = ref(-1);

let sceneriesData = ref<ISceneryData[] | null>(null);
let activeData = ref<API.ActiveData.Response | null>(null);

const selectedSceneryId = ref<string | null>(null);
const selectedCheckpointName = ref<string | null>(null);
const selectedRegion = ref('eu');

const autofillCheckpointName = ref(false);

onMounted(() => {
  autofillCheckpointName.value = StorageManager.getBooleanValue('fill-checkpoint');
  fetchSceneriesData();
});

onActivated(async () => {
  await fetchActiveData();
  handleQueries();

  window.clearInterval(refreshInterval.value);

  refreshInterval.value = window.setInterval(() => {
    fetchActiveData();
  }, 25000);
});

onDeactivated(() => {
  window.clearInterval(refreshInterval.value);
});

const selectedScenery = computed(() => {
  if (activeData.value == null) return null;

  return (
    activeData.value.activeSceneries?.find(
      (scenery) =>
        selectedSceneryId.value ==
          `${scenery.stationName}|${scenery.stationHash}|${scenery.dispatcherName}|${scenery.region}` &&
        selectedRegion.value == scenery.region
    ) ?? null
  );
});

const filteredSceneries = computed(() => {
  return activeData.value?.activeSceneries
    ?.filter((s) => s.isOnline && s.region == selectedRegion.value)
    .sort((s1, s2) => s1.stationName.localeCompare(s2.stationName));
});

const checkpointNameList = computed(() => {
  if (!selectedScenery.value) return [];

  const checkpoints =
    sceneriesData.value?.find((s) => s.name == selectedScenery.value?.stationName)?.checkpoints ??
    '';

  if (checkpoints.length == 0) return [selectedScenery.value.stationName];

  return checkpoints.split(';');
});

const sceneryTrains = computed(() => {
  if (!selectedScenery.value || !activeData.value?.trains) return [];

  const scenery = selectedScenery.value;

  return activeData.value.trains
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
});

async function fetchSceneriesData() {
  const data = (await http.get<ISceneryData[]>('api/getSceneries')).data;

  sceneriesData.value = data ?? null;
}

async function fetchActiveData() {
  const data = (await http.get<API.ActiveData.Response>('api/getActiveData')).data;

  activeData.value = data ?? null;
}

function selectCheckpointOption() {
  selectedCheckpointName.value =
    checkpointNameList.value.length == 0 ? null : checkpointNameList.value[0];
}

function onAutofillChange() {
  StorageManager.setBooleanValue('fill-checkpoint', autofillCheckpointName.value);
}

function fillOrderData(train: API.ActiveTrains.Data) {
  if (!selectedScenery.value) return;

  const scenery = selectedScenery.value;

  store.orderData.header.A = train.trainNo.toString();
  store.orderData.header.C = train.currentStationName;
  store.orderData.header.D = scenery.stationName;

  store.orderData.footer.V = train.driverName;
  store.orderData.footer.W = scenery.dispatcherName;

  const idData = store.orderData.footer.Z.split('-');

  if (idData.length != 4) {
    store.orderData.footer.Z = getOrderFullId(0, scenery.stationHash);
  } else {
    store.orderData.footer.Z = getOrderFullId(Number(idData[1]) || 0, scenery.stationHash);
  }

  store.panelMode = 'OrderMessagePanel';
}

function handleQueries() {
  const query = new URLSearchParams(window.location.search);

  const id = query.get('sceneryId');

  if (id) {
    const [sceneryName, sceneryRegion] = id.split('|');

    selectedRegion.value = sceneryRegion;

    const queryScenery = activeData.value?.activeSceneries?.find(
      (sc) => sc.stationName == sceneryName && sc.region == sceneryRegion && sc.isOnline
    );

    if (queryScenery) {
      selectedSceneryId.value = `${queryScenery.stationName}|${queryScenery.stationHash}|${queryScenery.dispatcherName}|${queryScenery.region}`;

      selectCheckpointOption();

      store.panelMode = 'OrderTrainPickerPanel';
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../styles/colors';

.order-train-picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 0.5em;
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
