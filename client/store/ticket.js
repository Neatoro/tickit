import { defineStore } from 'pinia';

export const useTicketStore = defineStore('ticket', {
  state() {
    return {
      tickets: []
    };
  },
  actions: {
    async loadTickets() {
      const response = await fetch('/api/ticket/search');
      const { data } = await response.json();

      this.tickets = data;
    }
  }
});
