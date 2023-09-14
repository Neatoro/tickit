import { DataSource } from 'typeorm';
import { FieldValues, Ticket, TicketSchema } from './ticket.entities';
import { CreateTicketDTO } from './ticket.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketService {
  constructor(private readonly dataSource: DataSource) {}

  async create(dto: CreateTicketDTO) {
    const fields = Object.keys(dto.fields)
      .map((field) => ({
        field,
        value: dto.fields[field]
      }))
      .map((field) => new FieldValues(field));

    const ticket = new Ticket({
      ...dto,
      fields
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    return await queryRunner.manager.save(ticket);
  }

  async search() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const result = await queryRunner.manager.find(TicketSchema, {
      relations: ['fields']
    });

    return result.map((ticket) => ({
      ...ticket,
      fields: ticket.fields.reduce(
        (fields, field) => ({ ...fields, [field.field]: field.value }),
        {}
      )
    }));
  }
}
