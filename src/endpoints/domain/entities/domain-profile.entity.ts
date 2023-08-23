import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import DomainEntity from './domain.entity';

@Entity('profiles')
export default class DomainProfileEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ nullable: true, unique: true })
  name: string = '';

  @Column({ nullable: true })
  public username: string;

  @Column({ nullable: true })
  public avatar: string;

  @Column({ nullable: true })
  public location: string;

  @Column({ nullable: true })
  public website: string;

  @Column({ nullable: true })
  public shortbio: string;

  @Column({ nullable: true })
  public telegram: string;

  @Column({ nullable: true })
  public discord: string;

  @Column({ nullable: true })
  public twitter: string;

  @Column({ nullable: true })
  public medium: string;

  @Column({ nullable: true })
  public facebook: string;

  @Column({ nullable: true })
  public otherLink: string;

  @Column({ nullable: true })
  public walletEgld: string;

  @Column({ nullable: true })
  public walletEth: string;

  @Column({ nullable: true })
  public walletBtc: string;

  @Column({ type: 'jsonb', nullable: true })
  public textRecords: object[];

  @Column()
  public txHash: string;

  @OneToOne(() => DomainEntity)
  domain?: DomainEntity;

  @Column({ nullable: true, unique: true })
  public domainId: number;

  @CreateDateColumn()
  readonly createdAt: Date = new Date();

  @UpdateDateColumn()
  readonly updatedAt: Date = new Date();
}
