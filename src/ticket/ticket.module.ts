import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldValuesSchema, TicketSchema } from './ticket.entities';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketSchema, FieldValuesSchema])],
  controllers: [TicketController],
  providers: [TicketService]
})
export class TicketModule {}
