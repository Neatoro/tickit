import { defineStore } from 'pinia';

export const useProjectStore = defineStore('project', {
  state() {
    return {
      projects: [],
      project: undefined
    };
  },
  getters: {
    getProjectById(state) {
      return (projectId) =>
        state.projects.find((project) => project.id === projectId);
    }
  },
  actions: {
    async loadProjects() {
      const response = await fetch('/api/project');
      const { projects } = await response.json();

      this.projects = projects;
    }
  }
});
