import { EntitySchema } from 'typeorm';

export class Ticket {
  constructor(
    args: {
      project?: string;
      summary?: string;
      fields?: FieldValues[];
    } = {}
  ) {
    this.project = args.project;
    this.summary = args.summary;
    this.fields = args.fields;
  }

  id: number;

  project: string;

  summary: string;

  fields: FieldValues[];
}

export const TicketSchema = new EntitySchema<Ticket>({
  name: 'Ticket',
  target: Ticket,
  columns: {
    id: {
      type: Number,
      primary: true,
      nullable: false
    },
    project: {
      type: String,
      primary: true,
      nullable: false
    },
    summary: {
      type: String,
      nullable: false
    }
  },
  relations: {
    fields: {
      target: () => FieldValues,
      type: 'one-to-many',
      cascade: true,
      inverseSide: 'ticket'
    }
  }
});

export class FieldValues {
  constructor(args: { field?: string; value?: string } = {}) {
    this.field = args.field;
    this.value = args.value;
  }

  ticket: number;

  project: string;

  field: string;

  value: string;
}

export const FieldValuesSchema = new EntitySchema<FieldValues>({
  name: 'FieldValues',
  target: FieldValues,
  columns: {
    ticket: {
      type: Number,
      primary: true,
      nullable: true
    },
    project: {
      type: String,
      primary: true,
      nullable: true
    },
    field: {
      type: String,
      primary: true,
      nullable: false
    },
    value: {
      type: String,
      nullable: true
    }
  },
  relations: {
    ticket: {
      primary: true,
      target: () => Ticket,
      type: 'many-to-one',
      nullable: false,
      joinColumn: [
        { name: 'ticket', referencedColumnName: 'id' },
        { name: 'project', referencedColumnName: 'project' }
      ]
    }
  }
});
