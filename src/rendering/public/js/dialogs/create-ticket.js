class DialogConfirmEvent extends Event {
  constructor(fields) {
    super('confirm');
    this.fields = fields;
  }
}

(() => {
  const dialog = document.querySelector('#createTicketDialog');
  const form = dialog.querySelector('form');

  dialog.addEventListener('close', () => {
    const inputFields = [...dialog.querySelectorAll('input')];
    inputFields.forEach((input) => {
      const defaultValue = input.getAttribute('data-default') || '';
      input.value = defaultValue;
    });
  });

  const closeButton = dialog.querySelector('.dialog__close');
  closeButton.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.close();
  });

  const cancelButton = dialog.querySelector('.button--abort');
  cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.close();
  });

  const confirmButton = dialog.querySelector('.button--confirm');
  confirmButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (form.checkValidity()) {
      const fields = [...dialog.querySelectorAll('form .field__value')].reduce(
        (acc, input) => ({ ...acc, [input.getAttribute('id')]: input.value }),
        {}
      );

      dialog.dispatchEvent(new DialogConfirmEvent(fields));
      dialog.close();
    } else {
      form.reportValidity();
    }
  });
})();
