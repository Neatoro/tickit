export function getPossibleTransitions(ticket) {
  const workflow = ticket.type.workflow || [];
  const { transitions = [] } =
    workflow.find(
      (workflowElement) => workflowElement.status === ticket.status.name
    ) || {};

  const alwaysTransitions = ticket.type.workflow
    .filter((workflowElement) => workflowElement.transitionFromAll)
    .filter((workflowElement) => workflowElement.status !== ticket.status.name)
    .map((workflowElement) => ({
      name: workflowElement.status,
      target: workflowElement.status
    }));

  return [...transitions, ...alwaysTransitions];
}
