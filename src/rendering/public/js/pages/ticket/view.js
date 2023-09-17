import { Store } from '../../common/store.js';

const store = Store.initStore();

const transitionButtons = document.querySelectorAll('.js-transition-button');

transitionButtons.forEach((button) =>
  button.addEventListener('click', transitionTicket)
);

async function transitionTicket(event) {
  const newStatus = event.target.getAttribute('data-status');

  const apiPath = window.location.pathname
    .split('/')
    .filter((part) => part !== '')
    .join('/');

  const response = await fetch(`/api/${apiPath}/transition`, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ newStatus })
  });

  if (response.status === 200) {
    store.state.ticket.status = store.state.project.status.find(
      (status) => status.name === newStatus
    );
  }
}

store.addBinding(
  document.querySelector('#status'),
  'ticket.status',
  ({ node, state }) => {
    const { ticket } = state;
    const classes = ['badge', `badge-status-${ticket.status.type}`];

    node.className = classes.join(' ');
    node.innerText = ticket.status.name;
  }
);

store.addBinding(
  document.querySelector('#actionbar'),
  'ticket.status',
  ({ node, state }) => {
    const { ticket } = state;

    const { transitions } = ticket.type.workflow.find(
      (workflowElement) => workflowElement.status === ticket.status.name
    );

    const container = document.createElement('span');
    container.id = 'transition-buttons';

    for (const transition of transitions) {
      const button = document.createElement('button');
      button.classList.add('button');
      button.setAttribute('data-status', transition.target);
      button.innerText = transition.name;
      button.addEventListener('click', transitionTicket);

      container.appendChild(button);
    }

    node.querySelector('#transition-buttons').replaceWith(container);
  }
);
