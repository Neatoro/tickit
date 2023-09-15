import { Module } from '@nestjs/common';
import { TicketModule } from '../ticket/ticket.module';
import { RootRendering } from './controller/root.rendering';
import { TicketRendering } from './controller/ticket.rendering';

@Module({
  imports: [TicketModule],
  controllers: [RootRendering, TicketRendering]
})
export class RenderingModule {}
