import { DataSource } from 'typeorm';
import { FieldValues, Ticket, TicketSchema } from './ticket.entities';
import { CreateTicketDTO } from './ticket.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TicketTransformer } from './ticket.transformer';

@Injectable()
export class TicketService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly ticketTransformer: TicketTransformer
  ) {}

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

    const savedTicket = await queryRunner.manager.save(ticket);

    return this.ticketTransformer.transformToFullTicket(savedTicket);
  }

  async get(projectId: string, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const ticket = await queryRunner.manager.findOne(TicketSchema, {
      relations: ['fields'],
      where: {
        project: projectId,
        id
      }
    });

    return ticket
      ? this.ticketTransformer.transformToFullTicket(ticket)
      : undefined;
  }

  async search(filter?: { project }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const result = await queryRunner.manager.find(TicketSchema, {
      relations: ['fields'],
      where: filter
    });

    return result.map((ticket) =>
      this.ticketTransformer.transformToFullTicket(ticket)
    );
  }

  getSchema(projectId: string, typeName: string) {
    const project = this.configService
      .get('projects')
      .find((project) => project.id === projectId);

    if (!project) {
      throw new Error(`Could not find project "${projectId}"`);
    }

    const type = project.tickettypes.find((type) => type.name === typeName);

    if (type) {
      return type.fields;
    } else {
      throw new Error(
        `Could not find tickettype "${typeName}" in project "${projectId}"`
      );
    }
  }

  async transition(projectId: string, ticketId: number, newStatus: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    const ticket: Ticket = await queryRunner.manager.findOne(TicketSchema, {
      where: {
        project: projectId,
        id: ticketId
      }
    });

    ticket.status = newStatus;

    return await queryRunner.manager.save(ticket);
  }
}
