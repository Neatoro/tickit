import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common';
import { TicketService } from '../../ticket/ticket.service';
import { ConfigService } from '@nestjs/config';

@Controller('/ticket')
export class TicketRendering {
  constructor(
    private readonly ticketService: TicketService,
    private readonly configService: ConfigService
  ) {}

  getPossibleTransitions(ticket) {
    const { transitions } = ticket.type.workflow.find(
      (workflowElement) => workflowElement.status === ticket.status.name
    );

    const alwaysTransitions = ticket.type.workflow
      .filter((workflowElement) => workflowElement.transitionFromAll)
      .filter(
        (workflowElement) => workflowElement.status !== ticket.status.name
      )
      .map((workflowElement) => ({
        name: workflowElement.status,
        target: workflowElement.status
      }));

    return [...transitions, ...alwaysTransitions];
  }

  @Get('/:projectId/:id')
  @Render('ticket/view')
  async specificTicket(
    @Param('projectId') projectId: string,
    @Param('id', ParseIntPipe) id: number
  ) {
    const ticket = await this.ticketService.get(projectId, id);
    const schema = this.ticketService.getSchema(projectId, ticket.type.name);

    const project = this.configService
      .get('projects')
      .find((project) => project.id == projectId);

    const transitions = this.getPossibleTransitions(ticket);

    return {
      ticket,
      schema,
      possibleTransitions: transitions,
      project
    };
  }
}
