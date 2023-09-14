import { Repository } from 'typeorm';
import { Ticket } from './ticket.entities';
import { InjectRepository } from '@nestjs/typeorm';

export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>
  ) {}

  async create(dbo) {
    const ticket = this.ticketRepository.create(dbo);
    return await this.ticketRepository.save(ticket);
  }
}
