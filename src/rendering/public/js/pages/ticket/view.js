import { setupBindingModule } from '../../common/binding.js';

const { elements, context } = setupBindingModule();

const transitionButtons = document.querySelectorAll('.js-transition-buttton');

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
    const ticket = await response.json();
    context.ticket.status = context.project.status.find(
      (status) => status.name === newStatus
    );
  }
}

elements.status.addUpdate('ticket.status.type', function () {
  const { ticket } = context;

  const defaultClasses = ['badge'];

  const statusClass = `badge-status-${ticket.status.type}`;

  this.dom.className = '';
  this.dom.classList.add(...defaultClasses, statusClass);
});

elements.status.addUpdate('ticket.status.name', function () {
  const { ticket } = context;

  this.dom.innerText = ticket.status.name;
});
