import { Body, Controller, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDTO } from './ticket.interface';

@Controller('/api/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() dto: CreateTicketDTO) {
    return this.ticketService.create({
      project: dto.project,
      summary: dto.summary,
      fields: dto.fields
    });
  }
}
