import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateTicketDTO {
  @IsNotEmpty()
  @IsString()
  project: string;

  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsNotEmpty()
  @IsObject()
  fields: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  type: string;
}
