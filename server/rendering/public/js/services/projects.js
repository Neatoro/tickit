export async function loadProjects() {
  const response = await fetch('/api/project');
  const { projects } = await response.json();
  return projects;
}
