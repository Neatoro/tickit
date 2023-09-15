import { Controller, Get, Param, Render } from '@nestjs/common';
import { TicketService } from '../../ticket/ticket.service';
import { ConfigService } from '@nestjs/config';

@Controller('/project')
export class ProjectRendering {
  constructor(
    private readonly ticketService: TicketService,
    private readonly configService: ConfigService
  ) {}

  @Get('/:projectId')
  @Render('index')
  async root(@Param('projectId') projectId: string) {
    const tickets = await this.ticketService.search({
      project: projectId
    });

    return {
      tickets: tickets.map((ticket) => ({
        ...ticket,
        project: this.configService
          .get('projects')
          .find((project) => project.id == ticket.project)
      }))
    };
  }
}
