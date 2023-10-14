<script setup>
import Navigation from './components/Navigation.vue';
</script>

<template>
  <Navigation></Navigation>
  <header class="app__header"></header>
  <main class="app__content">
    <div class="app__content__container">
      <router-view></router-view>
    </div>
  </main>
</template>
