<template>
  <nav class="navigation">
    <h1 class="navigation__title">
      Tick<span style="color: var(--secondary-color)">IT</span>
    </h1>
    <div class="action-bar">
      <button class="button" id="createTicketButton">Create Ticket</button>
    </div>
    <ul class="navigation__list">
      <li class="navigation__item" id="navhome">
        <svg class="icon">
          <use xlink:href="../icons.svg#icon-home" />
        </svg>
        <a href="/">Home</a>
      </li>
      <li class="navigation__item" id="navprojects">
        <svg class="icon">
          <use xlink:href="../icons.svg#icon-folder_open" />
        </svg>
        <a href="/project">Projects</a>
      </li>
      <li class="navigation__item" id="navprojects">
        <svg class="icon">
          <use xlink:href="../icons.svg#icon-developer_board" />
        </svg>
        <a href="/board">Boards</a>
      </li>
    </ul>
  </nav>
</template>
