export const getOrderFullId = (orderNumber: string, sceneryHash: string) => {
  return `RD-${orderNumber}-${sceneryHash}-${new Date().getUTCFullYear().toString().slice(2)}`;
};

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

    if (radioCheckedAttr == null)
      return node.setAttribute('placeholder', node.getAttribute('holder')!);
    if (radioCheckedAttr == 'true')
      return node.setAttribute('placeholder', node.getAttribute('holder')!);
    if (node.getAttribute('placeholder') == null) return;

    node.setAttribute('holder', node.getAttribute('placeholder')!);
    node.removeAttribute('placeholder');
  });
};