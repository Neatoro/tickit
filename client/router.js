import { createRouter, createWebHistory } from 'vue-router';
import Home from './routes/Home.vue';
import Foo from './routes/Foo.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/foo',
      component: Foo
    }
  ]
});
