const createTicketButton = document.querySelector('#createTicketButton');
const createTicketDialog = document.querySelector('#createTicketDialog');

createTicketButton.addEventListener('click', (event) => {
  event.preventDefault();
  createTicketDialog.showModal();
});

createTicketDialog.addEventListener('confirm', (event) => {
  console.log(event.fields);
});
