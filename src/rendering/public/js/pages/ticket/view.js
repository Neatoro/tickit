import { setupBindingModule } from '../../common/binding.js';

const { elements, context } = setupBindingModule();

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

elements.actionbar.addUpdate('ticket.status', function () {
  const { ticket } = context;

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

  this.dom.querySelector('#transition-buttons').replaceWith(container);
});
