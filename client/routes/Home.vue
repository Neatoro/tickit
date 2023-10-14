<script setup>
import { useProjectStore } from '../store/project';
import { useTicketStore } from '../store/ticket';

const projectStore = useProjectStore();
projectStore.loadProjects();

const ticketStore = useTicketStore();
ticketStore.loadTickets();
</script>

<template>
  <p class="breadcumb">
    <a href="/">Home</a>
  </p>
  <h1 class="app__title">Overview</h1>
  <table class="table-list box">
    <thead class="table-list__header">
      <th>Ticket-ID</th>
      <th>Type</th>
      <th>Summary</th>
      <th>Status</th>
      <th>Project</th>
    </thead>
    <tbody class="table-list__body">
      <tr class="table-list__element" v-for="ticket in ticketStore.tickets">
        <td>
          <a href="/ticket/{{ticket.project}}/{{ticket.id}}"
            >{{ ticket.project }}-{{ ticket.id }}</a
          >
        </td>
        <td>{{ ticket.type.name }}</td>
        <td>{{ ticket.summary }}</td>
        <td>
          <span
            class="badge"
            :class="{ [`badge-status-${ticket.status.type}`]: true }"
            >{{ ticket.status.name }}</span
          >
        </td>
        <td>{{ projectStore.getProjectById(ticket.project).name }}</td>
      </tr>
    </tbody>
  </table>
</template>
