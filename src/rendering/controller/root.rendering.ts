import { Controller, Get, Render } from '@nestjs/common';
import { TicketService } from '../../ticket/ticket.service';

@Controller('/')
export class RootRendering {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @Render('index')
  async root() {
    const tickets = await this.ticketService.search();
    return {
      tickets
    };
  }
}
