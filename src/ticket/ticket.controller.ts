import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDTO } from './ticket.interface';
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
}
