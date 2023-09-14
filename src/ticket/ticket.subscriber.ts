import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent
} from 'typeorm';
import { Ticket } from './ticket.entities';

@EventSubscriber()
export class TicketSubscriber implements EntitySubscriberInterface<Ticket> {
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
  }
}
