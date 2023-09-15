import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldValuesSchema, TicketSchema } from './ticket.entities';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { ValidationModule } from '../validations/validation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketSchema, FieldValuesSchema]),
    ValidationModule
  ],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService]
})
export class TicketModule {}
