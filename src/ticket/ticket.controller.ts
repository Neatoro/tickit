import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDTO, TransitionTicketDTO } from './ticket.interface';
import { ValidationService } from '../validations/validation.service';

@Controller('/api/ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly validations: ValidationService
  ) {}

  @Post()
  async create(@Body() dto: CreateTicketDTO) {
    const validationResult = await this.validations
      .createValidation()
      .isValidProject(dto.project)
      .isValidTicketType(dto.project, dto.type)
      .areValidFields(dto.project, dto.type, dto.fields)
      .validate();

    if (!validationResult.result) {
      throw new BadRequestException(validationResult.errors);
    }

    return await this.ticketService.create({
      project: dto.project,
      summary: dto.summary,
      fields: dto.fields,
      type: dto.type
    });
  }

  @Get('/search')
  async search() {
    return {
      data: await this.ticketService.search()
    };
  }

  @Get('/:projectId/:type')
  async getSchema(
    @Param('projectId') projectId: string,
    @Param('type') type: string
  ) {
    const validationResult = await this.validations
      .createValidation()
      .isValidProject(projectId)
      .isValidTicketType(projectId, type)
      .validate();

    if (!validationResult.result) {
      throw new BadRequestException(validationResult.errors);
    }

    return {
      fields: this.ticketService.getSchema(projectId, type)
    };
  }

  @Put('/:projectId/:ticketId/transition')
  async transition(
    @Param('projectId') projectId: string,
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() dto: TransitionTicketDTO
  ) {
    const projectValidationResult = await this.validations
      .createValidation()
      .isValidProject(projectId)
      .validate();

    if (!projectValidationResult.result) {
      throw new BadRequestException(projectValidationResult.errors);
    }

    const ticket = await this.ticketService.get(projectId, ticketId);

    if (!ticket) {
      throw new NotFoundException([
        `Ticket ${projectId}-${ticketId} not found`
      ]);
    }

    const statusValidationResult = await this.validations
      .createValidation()
      .isValidStatus(projectId, ticket.type, dto.newStatus)
      .canTransitionToStatus(
        projectId,
        ticket.type.name,
        ticket.status.name,
        dto.newStatus
      )
      .validate();

    if (!statusValidationResult.result) {
      throw new BadRequestException(statusValidationResult.errors);
    }

    return await this.ticketService.transition(
      projectId,
      ticketId,
      dto.newStatus
    );
  }
}
