import { Controller, Get, Param, Render } from '@nestjs/common';
import { TicketService } from '../../ticket/ticket.service';
import { ConfigService } from '@nestjs/config';

@Controller('/project')
export class ProjectRendering {
  constructor(
    private readonly ticketService: TicketService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Render('project/index')
  async root() {
    return {
      projects: this.configService.get('projects')
    };
  }

  @Get('/:projectId')
  @Render('project/view')
  async single(@Param('projectId') projectId: string) {
    const tickets = await this.ticketService.search({
      project: projectId
    });

    const project = this.configService
      .get('projects')
      .find((project) => project.id == projectId);

    return {
      project,
      tickets: tickets.map((ticket) => ({
        ...ticket,
        project
      }))
    };
  }
}
