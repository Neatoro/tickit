import { Body, Controller, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('/api/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() dbo) {
    return this.ticketService.create(dbo);
  }
}
