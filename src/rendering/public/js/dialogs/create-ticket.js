import { Store } from '../common/store.js';
import { h } from '../common/render.js';

const store = Store.initStore();

class TicketCreatedEvent extends Event {
  constructor(ticket) {
    super('success');
    this.ticket = ticket;
  }
}

const inputGenerators = {
  longtext(field) {
    return h('textarea', {
      id: field.id,
      required: field.required,
      class: 'input textarea',
      rows: 5
    });
  }
};

async function getSchema(project, type) {
  const response = await fetch(`/api/ticket/${project}/${type}`);

  const data = await response.json();

  return data.fields;
}

async function generateTypeFields(project, type) {
  const fields = await getSchema(project, type);

  return fields.map((field) => {
    const input = inputGenerators[field.type](field);
    input.classList.add('field__value');
    return h(
      'div',
      {
        class: 'field'
      },
      [
        h(
          'label',
          {
            class: 'field__label',
            for: field.id
          },
          [field.name]
        ),
        input
      ]
    );
  });
}

async function renderTypeFields(project, type) {
  const fieldset = document.querySelector('#createTicketDialog #fields');
  [...fieldset.querySelectorAll('.field')].forEach((field) => field.remove());
  const typeFields = await generateTypeFields(project, type);

  typeFields.forEach((typeField) => fieldset.appendChild(typeField));
}

(async () => {
  const dialog = document.querySelector('#createTicketDialog');
  const form = dialog.querySelector('form');

  const project = store.state.project.id;
  const initalType = store.state.project.tickettypes[0].name;

  await renderTypeFields(project, initalType);

  const typeSelect = form.querySelector('#type');
  typeSelect.addEventListener('change', async (event) => {
    await renderTypeFields(project, event.target.value);
  });

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
  confirmButton.addEventListener('click', async (event) => {
    event.preventDefault();
    if (form.checkValidity()) {
      const fields = [...dialog.querySelectorAll('form .field__value')].reduce(
        (acc, input) => ({ ...acc, [input.getAttribute('id')]: input.value }),
        {}
      );

      const { summary, type, ...rest } = fields;
      const response = await fetch('/api/ticket', {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          summary,
          type,
          project: store.state.project.id,
          fields: rest
        })
      });

      const ticket = await response.json();

      dialog.dispatchEvent(new TicketCreatedEvent(ticket));
      dialog.close();
    } else {
      form.reportValidity();
    }
  });
})();
