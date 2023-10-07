import { Store } from '../../common/store.js';
import { h } from '../../common/render.js';

const store = Store.initStore();

const createTicketDialog = document.querySelector('#createTicketDialog');

createTicketDialog.addEventListener('success', (event) => {
  if (event.ticket.project === store.state.project.id) {
    store.state.tickets = [...store.state.tickets, event.ticket];
  }
});

store.addBinding(
  document.querySelector('.table-list__body'),
  'tickets',
  ({ node, state }) => {
    const newTicket = state.tickets[state.tickets.length - 1];
    const newRow = h(
      'tr',
      {
        class: 'table-list__element'
      },
      [
        h('td', {}, [
          h('a', { href: `/ticket/${newTicket.project}/${newTicket.id}` }, [
            `${newTicket.project}-${newTicket.id}`
          ])
        ]),
        h('td', {}, [newTicket.type.name]),
        h('td', {}, [newTicket.summary]),
        h('td', {}, [
          h('span', { class: `badge badge-status-${newTicket.status.type}` }, [
            newTicket.status.name
          ])
        ])
      ]
    );

    node.appendChild(newRow);
  }
);
