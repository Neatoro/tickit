import { Controller, Get, Render } from '@nestjs/common';
import { TicketService } from '../../ticket/ticket.service';
import { ConfigService } from '@nestjs/config';

@Controller('/')
export class RootRendering {
  constructor(
    private readonly ticketService: TicketService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Render('index')
  async root() {
    const tickets = await this.ticketService.search();

    return {
      tickets: tickets.map((ticket) => {
        const project = this.configService
          .get('projects')
          .find((project) => project.id == ticket.project);

        return {
          ...ticket,
          project,
          status: project.status.find((status) => status.name === ticket.status)
        };
      })
    };
  }
}
