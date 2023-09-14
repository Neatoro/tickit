import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateTicketDTO {
  @IsString()
  project: string;

  @IsString()
  summary: string;

  @IsNotEmpty()
  @IsObject()
  fields: Record<string, any>;
}
