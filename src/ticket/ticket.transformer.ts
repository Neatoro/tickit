import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TicketTransformer {
  constructor(private readonly configService: ConfigService) {}

  transformToFullTicket(ticket) {
    const projectConfig = this.configService
      .get('projects')
      .find((project) => project.id === ticket.project);

    return {
      ...ticket,
      status: projectConfig.status.find(
        (status) => status.name === ticket.status
      ),
      fields: ticket.fields.reduce(
        (acc, fieldValue) => ({ ...acc, [fieldValue.field]: fieldValue.value }),
        {}
      ),
      type: projectConfig.tickettypes.find((type) => type.name === ticket.type)
    };
  }
}
