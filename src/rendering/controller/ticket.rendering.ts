import { Controller, Get, Param, ParseIntPipe, Render } from '@nestjs/common';
import { TicketService } from '../../ticket/ticket.service';

@Controller('/ticket')
export class TicketRendering {
  constructor(private readonly ticketService: TicketService) {}

  @Get('/:projectId/:id')
  @Render('ticket/view')
  async specificTicket(
    @Param('projectId') projectId: string,
    @Param('id', ParseIntPipe) id: number
  ) {
    const ticket = await this.ticketService.get(projectId, id);
    const schema = this.ticketService.getSchema(projectId, ticket.type);

    return { ticket, schema };
  }
}
