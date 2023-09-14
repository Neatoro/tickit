import {
  Column,
  Entity,
  Generated,
  ManyToMany,
  OneToMany,
  PrimaryColumn
} from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryColumn()
  //@Generated('increment')
  id: number;

  @PrimaryColumn()
  project: string;

  @Column()
  summary: string;

  @OneToMany(() => FieldValues, (fieldValue) => fieldValue.ticket)
  fields: FieldValues[];
}

@Entity()
export class FieldValues {
  @PrimaryColumn()
  @ManyToMany(() => Ticket, (ticket) => ticket.fields)
  ticket: number;

  @PrimaryColumn()
  field: string;

  @Column({ nullable: true })
  value: string;
}
