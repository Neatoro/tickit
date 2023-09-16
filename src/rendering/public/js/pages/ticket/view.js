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
    window.location.reload();
  }
}
