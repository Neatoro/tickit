import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const fieldValueValidators = {
  default: () => false,
  longtext: (value) => typeof value === 'string' || value instanceof String
};

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

  areValidFields(
    projectId: string,
    typeName: string,
    fields: Record<string, any>
  ): Validation {
    const project = this.configService
      .get('projects')
      .find((project) => project.id === projectId) || { tickettypes: [] };

    const type = project.tickettypes.find((type) => type.name === typeName) || {
      fields: []
    };

    const transformedFields = Object.keys(fields).map((fieldKey) => ({
      field: fieldKey,
      value: fields[fieldKey]
    }));

    this.hasAllRequiredFields(type.fields, transformedFields);

    for (const field of transformedFields) {
      this.isValidField(type.fields, field);
      this.isValidFieldValue(type.fields, field);
    }

    return this;
  }

  private isValidField(validFields, field) {
    this.validations.push({
      validate: () =>
        validFields.filter((validField) => validField.id === field.field)
          .length === 1,
      error: `Invalid field "${field.field}"`
    });
  }

  private isValidFieldValue(validFields, field) {
    this.validations.push({
      validate: () => {
        const configField = validFields.find(
          (validField) => validField.id === field.field
        ) || { type: 'default' };

        return (
          (!configField.required || !!field.value) &&
          fieldValueValidators[configField.type](field.value)
        );
      },
      error: `Invalid field value for "${field.field}" (${field.value})`
    });
  }

  private hasAllRequiredFields(validFields, fields) {
    this.validations.push({
      validate: () => {
        const providedFieldIds = fields.map((field) => field.field);

        return validFields
          .map((validField) => validField.id)
          .reduce(
            (acc, validFieldId) =>
              acc && providedFieldIds.includes(validFieldId),
            true
          );
      },
      error: `Missing required fields`
    });
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
