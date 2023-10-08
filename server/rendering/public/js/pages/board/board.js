import { h } from '../../common/render.js';
import { Store } from '../../common/store.js';
import { getPossibleTransitions } from '../../common/transitions.js';

const store = Store.initStore();

let currentlyDraggedElement = undefined;

function calculateMovableColumns(ticketId) {
  const { columns } = store.state.board;

  const ticket = store.state.tickets.find((ticket) => ticket.id === ticketId);
  const transitions = getPossibleTransitions(ticket);

  const movableStatus = transitions.map((transition) => transition.target);

  const movableColumns = columns
    .map((_, index) => index)
    .filter((columnIndex) => {
      const intersectStatus = movableStatus.filter((status) =>
        columns[columnIndex].status.includes(status)
      );

      return intersectStatus.length > 0;
    });

  return movableColumns;
}

document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('dragstart', startDrag);
  card.addEventListener('dragend', endDrag);
});

function startDrag(event) {
  const id = Number(event.target.getAttribute('data-id'));

  const moveableColumns = calculateMovableColumns(id);

  const selector = moveableColumns
    .map((column) => `.kanban__column[data-column="${column}"]`)
    .join(',');

  const domColumns = document.querySelectorAll(selector);
  domColumns.forEach((domColumn) => {
    domColumn.addEventListener('dragover', onDragOver);
    domColumn.addEventListener('dragenter', onDragEnter);
    domColumn.addEventListener('dragleave', onDragLeave);
    domColumn.addEventListener('drop', onDrop);

    domColumn.classList.add('kanban__column--movable');
  });

  currentlyDraggedElement = event.target;
}

function endDrag() {
  const domColumns = document.querySelectorAll('.kanban__column');
  domColumns.forEach((domColumn) => {
    domColumn.removeEventListener('dragover', onDragOver);
    domColumn.removeEventListener('dragenter', onDragEnter);
    domColumn.removeEventListener('dragleave', onDragLeave);
    domColumn.removeEventListener('drop', onDrop);

    domColumn.classList.remove('kanban__column--movable', 'hover');
  });
}

function onDragEnter(event) {
  event.preventDefault();
  const column = findColumnDom(event.target);
  column.classList.add('hover');
}

function onDragLeave(event) {
  event.preventDefault();
  const column = findColumnDom(event.target);
  column.classList.remove('hover');
}

function onDragOver(event) {
  event.preventDefault();
}

async function onDrop(event) {
  const domColumn = findColumnDom(event.target);
  const columnId = Number(domColumn.getAttribute('data-column'));
  const column = store.state.board.columns[columnId];

  const projectId = store.state.project.id;
  const ticketId = Number(currentlyDraggedElement.getAttribute('data-id'));
  const newStatus = column.status[0];

  const oldColumn = store.state.board.columns.find(
    (column) => !!column.tickets.find((ticket) => ticket.id === ticketId)
  );

  const response = await fetch(
    `/api/ticket/${projectId}/${ticketId}/transition`,
    {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ newStatus })
    }
  );

  if (response.status === 200) {
    const ticket = store.state.tickets.find((ticket) => ticket.id === ticketId);
    ticket.status = store.state.project.status.find(
      (status) => status.name === newStatus
    );

    oldColumn.tickets = oldColumn.tickets.filter(
      (ticket) => ticket.id !== ticketId
    );
    column.tickets = [...column.tickets, ticket];
  }
}

for (const columnId in store.state.board.columns) {
  store.addBinding(
    document.querySelector(`.kanban__column[data-column="${columnId}"]`),
    'board.columns',
    ({ node, state }) => {
      const column = state.board.columns[columnId];
      if (column.tickets.length === 0 && !node.querySelector('.card--empty')) {
        [...node.querySelectorAll('.card')].forEach((child) => child.remove());
        node.appendChild(createNoTicket());
      }

      if (column.tickets.length > 0 && node.querySelector('.card--empty')) {
        node.querySelector('.card--empty').remove();
      }

      if (column.tickets.length > 0) {
        const cards = node.querySelectorAll('.card');

        const visibleTicketIds = [...cards].map((card) =>
          Number(card.getAttribute('data-id'))
        );
        const availableTicketIds = column.tickets.map((ticket) => ticket.id);

        visibleTicketIds
          .filter((id) => !availableTicketIds.includes(id))
          .map((id) => document.querySelector(`.card[data-id="${id}"]`))
          .filter((node) => node)
          .forEach((node) => node.remove());

        availableTicketIds
          .filter((id) => !visibleTicketIds.includes(id))
          .forEach((id) => {
            const card = createCard(id);
            node.appendChild(card);

            card.addEventListener('dragstart', startDrag);
            card.addEventListener('dragend', endDrag);
          });
      }
    }
  );
}

function createNoTicket() {
  return h('div', { class: 'card card--empty box' }, ['Current no Tickets']);
}

function createCard(ticketId) {
  const ticket = store.state.tickets.find((ticket) => ticket.id === ticketId);

  return h(
    'div',
    {
      class: 'card box',
      'data-id': ticketId,
      draggable: true
    },
    [
      h(
        'a',
        {
          href: `/ticket/${store.state.project.id}/${ticketId}`,
          class: 'card__link'
        },
        [`${store.state.project.id}-${ticketId}`]
      ),
      h(
        'h3',
        {
          class: 'card__title'
        },
        [ticket.summary]
      )
    ]
  );
}

function findColumnDom(element) {
  if (element.classList.contains('kanban__column')) {
    return element;
  } else {
    return findColumnDom(element.parentElement);
  }
}
