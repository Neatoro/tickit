import { Module } from '@nestjs/common';
import { TicketModule } from '../ticket/ticket.module';
import { RootRendering } from './controller/root.rendering';
import { TicketRendering } from './controller/ticket.rendering';
import { ProjectRendering } from './controller/project.rendering';
import { BoardRendering } from './controller/board.rendering';

@Module({
  imports: [TicketModule],
  controllers: [
    RootRendering,
    TicketRendering,
    ProjectRendering,
    BoardRendering
  ]
})
export class RenderingModule {}
