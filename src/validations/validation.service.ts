import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

class Validation {
  private readonly validations: { validate: Function; error: string }[] = [];
  private readonly errors: string[] = [];

  constructor(private readonly configService: ConfigService) {}

  isValidProject(projectId: string): Validation {
    this.validations.push({
      validate: () =>
        this.configService
          .get('projects')
          .filter((project) => project.id === projectId).length === 1,
      error: `Invalid project "${projectId}"`
    });

    return this;
  }

  isValidTicketType(projectId: string, typeName: string): Validation {
    this.validations.push({
      validate: () => {
        const project = this.configService
          .get('projects')
          .find((project) => project.id === projectId);

        if (project) {
          const tickettypes = project.tickettypes;

          return (
            tickettypes.filter((type) => type.name === typeName).length === 1
          );
        }

        return false;
      },
      error: `Invalid type "${typeName}" in project "${projectId}"`
    });

    return this;
  }

  async validate(): Promise<{ result: boolean; errors: string[] }> {
    const results = await Promise.all(
      this.validations.map(async (validation) => {
        const result = await validation.validate();

        if (!result) {
          this.errors.push(validation.error);
        }

        return result;
      })
    );

    const result = results.reduce((acc, result) => acc && result, true);

    return {
      result,
      errors: this.errors
    };
  }
}

@Injectable()
export class ValidationService {
  constructor(private readonly configService: ConfigService) {}

  createValidation(): Validation {
    return new Validation(this.configService);
  }
}
