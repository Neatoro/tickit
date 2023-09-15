import { DataSource } from 'typeorm';
import { FieldValues, Ticket, TicketSchema } from './ticket.entities';
import { CreateTicketDTO } from './ticket.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TicketService {
  constructor(private readonly dataSource: DataSource, private readonly configService: ConfigService) {}

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

  getSchema(projectId: string, typeName: string) {
    const project = this.configService.get('projects').find((project) => project.id === projectId);

    if (!project) {
      throw new Error(`Could not find project "${projectId}"`);
    }

    const type = project.tickettypes.find((type) => type.name === typeName);

    if (type) {
      return type.fields;
    } else {
      throw new Error(`Could not find tickettype "${typeName}" in project "${projectId}"`);
    }
  }
}
