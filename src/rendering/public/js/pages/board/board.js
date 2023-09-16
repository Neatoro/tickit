import { setupBindingModule } from '../../common/binding.js';

const { context } = setupBindingModule();

let currentlyDraggedElement = undefined;

function findMovableColumns(ticketId) {
  const { columns } = context.board;

  const ticket = context.tickets.find((ticket) => ticket.id === ticketId);
  const { transitions } = ticket.type.workflow.find(
    (workflow) => workflow.status === ticket.status
  );

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

  const moveableColumns = findMovableColumns(id);

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
  event.target.classList.add('hover');
}

function onDragLeave(event) {
  event.preventDefault();
  event.target.classList.remove('hover');
}

function onDragOver(event) {
  event.preventDefault();
}

async function onDrop(event) {
  const domColumn = findColumn(event.target);
  const columnId = Number(domColumn.getAttribute('data-column'));
  const column = context.board.columns[columnId];

  const projectId = context.project.id;
  const ticketId = Number(currentlyDraggedElement.getAttribute('data-id'));
  const newStatus = column.status[0];

  const oldColumn = context.board.columns.find(
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
    const ticket = context.tickets.find((ticket) => ticket.id === ticketId);
    ticket.status = newStatus;

    oldColumn.tickets = oldColumn.tickets.filter(
      (ticket) => ticket.id !== ticketId
    );
    column.tickets = [...column.tickets, ticket];

    const domOldColumn = currentlyDraggedElement.parentElement;

    if (!!domColumn.querySelector('.card--empty')) {
      domColumn
        .querySelector('.card--empty')
        .replaceWith(currentlyDraggedElement);
    } else {
      domColumn.appendChild(currentlyDraggedElement);
    }

    if (oldColumn.tickets.length === 0) {
      domOldColumn.appendChild(createNoTicket());
    }
  }
}

function createNoTicket() {
  const empty = document.createElement('div');
  empty.classList.add('card', 'card--empty', 'box');
  empty.innerText = 'Currently no Tickets';

  return empty;
}

function findColumn(element) {
  if (!element) {
    throw 'Failed to find correct column';
  }

  if (element.classList.contains('kanban__column')) {
    return element;
  } else {
    return findColumn(element.parentElement);
  }
}
