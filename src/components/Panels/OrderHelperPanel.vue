<template>
  <div class="order-helper-panel">
    <div class="header-box">
      <h2 class="header">
        <HelpCircle :size="30" />
        <span>{{ $t('helper.header') }}</span>
      </h2>

      <div class="header-sub">{{ $t('helper.paragraph-1') }}</div>
    </div>

    <div class="helper-list">
      <div
        v-for="([instructionKey, helperInfo], i) in selectedInstructionsInfo"
        :key="instructionKey"
        class="instruction-info"
      >
        <hr v-if="i > 0" />

        <h2>
          {{ $t('helper.instruction-title') }}
          <span class="text--accent">{{ helperInfo.name }}</span>
        </h2>

        <h4>{{ $t('helper.instruction-usage-desc') }}</h4>

        <div
          v-html="$t(`helper.instructions.${instructionKey}.description`)"
          class="description"
        ></div>

        <div class="helper-fields" v-if="helperInfo.fields">
          <h4>{{ $t('helper.instruction-fields') }}</h4>

          <ul v-if="helperInfo.fields" class="fields-list">
            <li v-for="fieldKey in helperInfo.fields" :key="fieldKey">
              <span v-html="$t(`helper.instructions.${instructionKey}.fields.${fieldKey}`)"></span>
            </li>
          </ul>
        </div>

        <div v-if="helperInfo.hasWarnings" class="warnings">
          <h4>{{ $t('helper.instruction-warnings') }}</h4>
          <div v-html="$t(`helper.instructions.${instructionKey}.warnings`)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HelpCircle } from '@lucide/vue';
import { useStore } from '../../store/store';
import { computed } from 'vue';

const store = useStore();

interface HelperItem {
  name: string;
  hasWarnings: boolean;
  fields: string[] | null;
}

const helperData: Record<string, HelperItem> = {
  '22': {
    name: '22',
    hasWarnings: true,
    fields: null
  },
  '99': {
    name: '99',
    hasWarnings: false,
    fields: ['x1']
  },
  '2110': {
    name: '21.10',
    hasWarnings: true,
    fields: ['x1', 'x2', 'x3', 'x4', 'x5-7']
  },
  '2115': {
    name: '21.15',
    hasWarnings: true,
    fields: ['x1', 'x2', 'x3', 'x4-6']
  },
  '2120': {
    name: '21.20',
    hasWarnings: false,
    fields: ['x1', 'x2', 'x3']
  },
  '2125': {
    name: '21.25',
    hasWarnings: false,
    fields: ['x1', 'x2', 'x3', 'x4']
  },
  '2135': {
    name: '21.35',
    hasWarnings: false,
    fields: ['x1', 'x2']
  },
  '2140': {
    name: '21.40',
    hasWarnings: true,
    fields: ['x1', 'x2', 'x3', 'x96']
  },
  '2145': {
    name: '21.45',
    hasWarnings: false,
    fields: ['x1', 'x2']
  },
  '2150': {
    name: '21.50',
    hasWarnings: false,
    fields: ['x1', 'x2', 'x3']
  },
  '2155': {
    name: '21.55',
    hasWarnings: false,
    fields: ['x1', 'x2', 'x3']
  },
  '2160': {
    name: '21.60',
    hasWarnings: false,
    fields: ['x1', 'x2', 'x3', 'x4', 'x5']
  },
  '2165': {
    name: '21.65',
    hasWarnings: false,
    fields: ['x1', 'x2']
  },
  '2170': {
    name: '21.70',
    hasWarnings: false,
    fields: ['x1', 'x2', 'x3']
  },
  '2180': {
    name: '21.80',
    hasWarnings: true,
    fields: ['x1', 'x2', 'x3', 'x4', 'x5']
  },
  '2181': {
    name: '21.81',
    hasWarnings: true,
    fields: null
  },
  '2182': {
    name: '21.82',
    hasWarnings: true,
    fields: ['x1', 'x2']
  },
  '2183': {
    name: '21.83',
    hasWarnings: true,
    fields: ['x1', 'x2']
  },
  '2185': {
    name: '21.85',
    hasWarnings: true,
    fields: ['x1', 'x2', 'x3', 'x4']
  },
  '2310': {
    name: '23.10',
    hasWarnings: true,
    fields: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x91']
  },
  '2311': {
    name: '23.11',
    hasWarnings: false,
    fields: null
  },
  '2320': {
    name: '23.20',
    hasWarnings: false,
    fields: ['x96']
  }
};

const selectedInstructionsInfo = computed(() => {
  return Object.entries(helperData).filter(([key]) =>
    store.orderData.instructions.some((i) => i.active && i.key == key)
  );
});
</script>

<style lang="scss" scoped>
@use '../../styles/colors';

.order-helper-panel {
  overflow: auto;

  padding: 0 0.5em;
}

.header-box {
  background-color: colors.$bgColDarker;
  padding: 0.75em;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25em;
  
  margin: 0;
}

.header-sub {
  color: #ccc;
  text-align: center;
  margin-top: 0.5em;
}

.instruction-info {
  margin-top: 2em;
}

.instruction-info h2 {
  text-align: center;
}

.description {
  line-height: 1.5em;
  text-align: justify;
}

.helper-fields {
  margin-top: 1em;
}

.fields-list {
  line-height: 1.5em;
  text-align: justify;
}

.warnings {
  text-align: justify;
}

.warnings {
  color: colors.$warnCol;
}
</style>
