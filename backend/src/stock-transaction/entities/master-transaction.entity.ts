import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MasterStock } from './master-stock.entity';

@Entity()
export class MasterTransaction {
  @PrimaryColumn()
  nomor_transaksi!: string;

  @Column()
  sku!: string;

  @ManyToOne(() => MasterStock, (masterStock) => masterStock.transactions)
  @JoinColumn({ name: 'sku' })
  masterStock!: MasterStock;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  quantity!: number;

  @Column()
  keterangan!: string;

  @Column({
    type: 'boolean',
    default: 'false',
  })
  is_cancelled!: boolean;
}
