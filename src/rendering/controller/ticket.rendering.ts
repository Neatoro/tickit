import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common';
import { TicketService } from '../../ticket/ticket.service';
import { ConfigService } from '@nestjs/config';

@Controller('/ticket')
export class TicketRendering {
  constructor(
    private readonly ticketService: TicketService,
    private readonly configService: ConfigService
  ) {}

  @Get('/:projectId/:id')
  @Render('ticket/view')
  async specificTicket(
    @Param('projectId') projectId: string,
    @Param('id', ParseIntPipe) id: number
  ) {
    const ticket = await this.ticketService.get(projectId, id);
    const schema = this.ticketService.getSchema(projectId, ticket.type);

    const project = this.configService
      .get('projects')
      .find((project) => project.id == projectId);

    const status = project.status.find(
      (status) => status.name === ticket.status
    );

    const type = project.tickettypes.find(
      (type) => type.name === ticket.type
    ) || { workflow: [] };

    const { transitions = {} } =
      type.workflow.find(
        (workflowElement) => workflowElement.status === ticket.status
      ) || {};

    return {
      ticket: {
        ...ticket,
        type,
        status,
        transitions
      },
      schema,
      project
    };
  }
}
