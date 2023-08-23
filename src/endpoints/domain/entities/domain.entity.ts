import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import DomainProfileEntity from './domain-profile.entity';

@Entity('domains')
export default class DomainEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({unique: true})
  public name: string;

  @Column()
  public sender: string;

  @Column()
  public ownerAddress: string;

  @Column({type: 'bigint'})
  public timestamp: string;

  @Column()
  public duration: number;

  @Column({type: 'bigint'})
  public expiresAt: string;

  @Column()
  public priceEgld: string;

  @Column()
  public priceUsd: string;

  @Column({ type: String, nullable: true })
  public primaryAddress!: string | null;

  @Column({unique: true})
  public txHash: string;

  @Column({ default: false })
  public isSubdomain: boolean = false;

  @OneToOne(() => DomainProfileEntity)
  domain?: DomainProfileEntity;

  @CreateDateColumn()
  readonly createdAt: Date = new Date();

  @UpdateDateColumn()
  readonly updatedAt: Date = new Date();
}
