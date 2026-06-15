import { defineStore } from 'pinia';
import { ref } from 'vue';

type PopUpType = 'warning' | 'info' | 'success';

export const usePopupStore = defineStore('popup', () => {
  const popupType = ref<PopUpType>('info');
  const timeoutId = ref(-1);
  const htmlContent = ref('');
  const isVisible = ref(false);

  function showPopup(content: string, type: PopUpType, timeoutMs = 5000) {
    if (timeoutId.value != -1) {
      hidePopup();

      setTimeout(() => {
        showPopup(content, type, timeoutMs);
      }, 200);

      return;
    }

    popupType.value = type;
    htmlContent.value = content;
    isVisible.value = true;

    timeoutId.value = setTimeout(() => {
      hidePopup();
    }, timeoutMs);
  }

  function hidePopup() {
    clearTimeout(timeoutId.value);

    timeoutId.value = -1;
    isVisible.value = false;
  }

  function clearPopup() {
    clearTimeout(timeoutId.value);

    timeoutId.value = -1;
    isVisible.value = false;
    htmlContent.value = '';
    popupType.value = 'info';
  }

  return { popupType, htmlContent, isVisible, showPopup, clearPopup, hidePopup };
});
