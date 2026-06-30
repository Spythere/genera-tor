<template>
  <div class="order-helper-panel">
    <div class="header-box">
      <h2 class="header">
        <HelpCircle :size="30" />
        <span>{{ $t('helper.title') }}</span>
      </h2>
      
      <div class="subtitle">{{ $t('helper.subtitle') }}</div>
    </div>

    <div class="helper-header static-info">
      <h2>{{ $t('helper.header.name') }}</h2>

      <ul>
        <li><b>A</b> - {{ $t('helper.header.A') }}</li>
        <li><b>B</b> - {{ $t('helper.header.B') }}</li>
        <li><b>C</b> - {{ $t('helper.header.C') }}</li>
        <li><b>D</b> - {{ $t('helper.header.D') }}</li>
      </ul>
    </div>

    <div class="helper-footer static-info">
      <h2>{{ $t('helper.footer.name') }}</h2>

      <ul>
        <li><b>V</b> - {{ $t('helper.footer.V') }}</li>
        <li><b>W</b> - {{ $t('helper.footer.W') }}</li>
        <li><b>Y</b> - {{ $t('helper.footer.Y') }}</li>
        <li>
          <b>Z</b> - {{ $t('helper.footer.Z') }}

          <ul>
            <li>{{ $t('helper.footer.Z-1') }}</li>
            <li>
              {{ $t('helper.footer.Z-2') }}
            </li>
            <li>{{ $t('helper.footer.Z-3') }}</li>
          </ul>
        </li>
      </ul>
    </div>

    <hr />

    <p class="helper-reminder">{{ $t('helper.reminder') }}</p>

    <div class="helper-list" ref="list">
      <div
        v-for="([instructionKey, helperInfo], i) in selectedInstructionsInfo"
        :key="instructionKey"
        :data-key="instructionKey"
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
import { computed, nextTick, useTemplateRef, watch } from 'vue';

const store = useStore();
const listRef = useTemplateRef<HTMLElement>('list');

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

// Scrolling to the last enabled instruction
watch(
  computed(() => store.lastEnabledInstructionKey),
  () => {
    nextTick(() => {
      if (!listRef.value) return;

      listRef.value.childNodes.forEach((node) => {
        if (
          node instanceof HTMLElement &&
          node.getAttribute('data-key') == store.lastEnabledInstructionKey
        ) {
          node.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
);
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

.subtitle {
  color: #ccc;
  margin-top: 0.5em;
  text-align: center;
}

.helper-reminder {
  font-weight: bold;
  text-align: center;
  color: colors.$accentCol;
}

.instruction-info {
  margin-top: 2em;
}

.static-info h2,
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
