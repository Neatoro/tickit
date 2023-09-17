import { h } from '../../common/render.js';
import { Store } from '../../common/store.js';
import { getPossibleTransitions } from '../../common/transitions.js';

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

    const transitions = getPossibleTransitions(ticket);

    const container = h(
      'span',
      { id: 'transition-buttons' },
      transitions.map((transition) =>
        h('button', { class: 'button', 'data-status': transition.target }, [
          transition.name
        ])
      )
    );

    [...container.querySelectorAll('.button')].forEach((button) =>
      button.addEventListener('click', transitionTicket)
    );

    node.querySelector('#transition-buttons').replaceWith(container);
  }
);
