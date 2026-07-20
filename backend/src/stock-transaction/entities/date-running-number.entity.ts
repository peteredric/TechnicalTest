import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class DateRunningNumber {
  @PrimaryColumn()
  kombinasi_tanggal!: string;

  @Column()
  running_number!: number;
}
