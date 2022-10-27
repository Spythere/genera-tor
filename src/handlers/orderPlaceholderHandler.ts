// For use inside OrderS and OrderN
export const handleOrderPlaceholders = (isRowEnabled: boolean, rowRef: HTMLTableElement) => {
  rowRef.querySelectorAll('input[type="text"]').forEach((node) => {
    if (!isRowEnabled) {
      if (node.getAttribute('placeholder') != null) {
        node.setAttribute('holder', node.getAttribute('placeholder')!);
        node.removeAttribute('placeholder');
      }

      return;
    }

    if (!node.getAttribute('holder')) return;
    const radioCheckedAttr = node.getAttribute('radio-checked');

    if (radioCheckedAttr == null) return node.setAttribute('placeholder', node.getAttribute('holder')!);
    if (radioCheckedAttr == 'true') return node.setAttribute('placeholder', node.getAttribute('holder')!);
    if (node.getAttribute('placeholder') == null) return;

    node.setAttribute('holder', node.getAttribute('placeholder')!);
    node.removeAttribute('placeholder');
  });
};
