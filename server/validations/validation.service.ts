import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const fieldValueValidators = {
  default: () => false,
  longtext: (value) => typeof value === 'string' || value instanceof String,
  text: (value) => typeof value === 'string' || value instanceof String,
  select: (value, field) => field.values.includes(value)
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
          fieldValueValidators[configField.type](field.value, configField)
        );
      },
      error: `Invalid field value for "${field.field}" (${field.value})`
    });
  }

  private hasAllRequiredFields(typeFields, fields) {
    const requiredFields = typeFields.filter((field) => field.required);
    this.validations.push({
      validate: () => {
        const providedFieldIds = fields.map((field) => field.field);

        return requiredFields
          .map((requiredField) => requiredField.id)
          .reduce(
            (acc, requiredFieldId) =>
              acc && providedFieldIds.includes(requiredFieldId),
            true
          );
      },
      error: `Missing required fields`
    });
  }

  isValidStatus(
    projectId: string,
    typeName: string,
    status: string
  ): Validation {
    this.validations.push({
      validate: () => {
        const project = this.configService
          .get('projects')
          .find((project) => project.id === projectId) || {
          status: [],
          tickettypes: []
        };
        const type =
          project.tickettypes.find((type) => type.name === typeName) || {};

        if (type.workflow) {
          const validStatus = type.workflow.map(
            (workflowElement) => workflowElement.status
          );
          return validStatus.includes(status);
        } else {
          return project.status.map((status) => status.name).includes(status);
        }
      },
      error: `Invalid status "${status}"`
    });

    return this;
  }

  canTransitionToStatus(
    projectId: string,
    typeName: string,
    sourceStatus: string,
    targetStatus: string
  ): Validation {
    this.validations.push({
      validate: () => {
        if (sourceStatus === targetStatus) {
          return true;
        }

        const project = this.configService
          .get('projects')
          .find((project) => project.id === projectId) || { tickettypes: [] };
        const type =
          project.tickettypes.find((type) => type.name === typeName) || {};

        if (type.workflow) {
          const targetWorkflowElement =
            type.workflow.find(
              (workflowElement) => workflowElement.status === targetStatus
            ) || {};

          if (targetWorkflowElement.transitionFromAll) {
            return true;
          }

          const { transitions = [] } = type.workflow.find(
            (workflowElement) => workflowElement.status === sourceStatus
          );

          return transitions
            .map((transition) => transition.target)
            .includes(targetStatus);
        }

        return false;
      },
      error: `Cannot transition from status "${sourceStatus}" to "${targetStatus}"`
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
