import { Controller, Get, Render } from '@nestjs/common';
import { TicketService } from '../../ticket/ticket.service';
import { ConfigService } from '@nestjs/config';

@Controller('/board')
export class BoardRendering {
  constructor(
    private readonly ticketService: TicketService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Render('board/index')
  root() {
    const projects = this.configService.get('projects');

    return {
      projects
    };
  }
}
