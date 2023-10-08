import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent
} from 'typeorm';
import { Ticket } from './ticket.entities';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@EventSubscriber()
@Injectable()
export class TicketSubscriber implements EntitySubscriberInterface<Ticket> {
  constructor(
    dataSource: DataSource,
    private readonly configService: ConfigService
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Ticket;
  }

  async beforeInsert(event: InsertEvent<Ticket>) {
    const result = await event.manager
      .createQueryBuilder()
      .select('MAX(ticket.id)', 'maxId')
      .from(Ticket, 'ticket')
      .where({
        project: event.entity.project
      })
      .getRawOne();

    event.entity.id = result.maxId ? result.maxId + 1 : 1;

    const project = this.configService
      .get('projects')
      .find((project) => project.id === event.entity.project);

    const defaultStatus = project.status.find((status) => status.default);
    event.entity.status = defaultStatus.name;
  }
}
