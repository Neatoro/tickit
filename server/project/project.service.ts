import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProjectService {
  constructor(private readonly configService: ConfigService) {}

  list() {
    return this.configService.get('projects');
  }
}
