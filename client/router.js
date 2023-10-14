import { createRouter, createWebHistory } from 'vue-router';
import Home from './routes/Home.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    }
  ]
});
