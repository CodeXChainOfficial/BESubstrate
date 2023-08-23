import { InjectRepository } from '@nestjs/typeorm';
import DomainEntity from './entities/domain.entity';
import { IsNull, Like, Not, Repository } from 'typeorm';
import PaginationUtils from '../../utils/pagination.utils';
import { QueryPagination } from 'src/common/entities/query.paginations';
import DomainProfileEntity from './entities/domain-profile.entity';
import DomainProfileOverviewDto from './dtos/domain-profile-overview.dto';
import DomainProfileSocialDto from './dtos/domain-profile-social.dto';
import DomainProfileWalletDto from './dtos/domain-profile-wallet.dto';

export default class DomainRepository {
  constructor(
    @InjectRepository(DomainEntity)
    private readonly domainModel: Repository<DomainEntity>,
    @InjectRepository(DomainProfileEntity)
    private readonly domainProfileModel: Repository<DomainProfileEntity>,
  ) {}

  public async createDomain(
    name: string,
    sender: string,
    ownerAddress: string,
    timestamp: string,
    duration: number,
    txHash: string,
    expiresAt: string,
    priceEgld: string,
    priceUsd: string,
    isSubdomain: boolean,
  ) {
    const entity = this.domainModel.create({
      name,
      sender,
      ownerAddress,
      timestamp,
      duration,
      txHash,
      expiresAt,
      priceEgld,
      priceUsd,
      isSubdomain,
    });
    return await this.domainModel.save(entity);
  }

  public async UpdateDomainProfileOverview(name: string, profile: DomainProfileOverviewDto) {
    const found = await this.domainProfileModel.findOne({ where: { name } });

    //insert
    if (!found) {
      const entity = this.domainProfileModel.create({
        name,
        ...profile,
      });
      return await this.domainProfileModel.save(entity);
    } else {
      return await this.domainProfileModel.save({ ...profile, id: found.id });
    }
  }

  public async UpdateDomainProfileSocial(name: string, profile: DomainProfileSocialDto) {
    const found = await this.domainProfileModel.findOne({ where: { name } });

    //insert
    if (!found) {
      const entity = this.domainProfileModel.create({
        name,
        ...profile,
      });
      return await this.domainProfileModel.save(entity);
    } else {
      return await this.domainProfileModel.save({ ...profile, id: found.id });
    }
  }

  public async UpdateDomainProfileWallet(name: string, profile: DomainProfileWalletDto) {
    const found = await this.domainProfileModel.findOne({ where: { name } });

    //insert
    if (!found) {
      const entity = this.domainProfileModel.create({
        name,
        ...profile,
      });
      return await this.domainProfileModel.save(entity);
    } else {
      return await this.domainProfileModel.save({ ...profile, id: found.id });
    }
  }

  public async UpdateDomainProfileTextRecords(name: string, textRecords: any, txHash: string) {
    const found = await this.domainProfileModel.findOne({ where: { name } });

    //insert
    if (!found) {
      const entity = this.domainProfileModel.create({
        name,
        textRecords: textRecords,
        txHash,
      });
      return await this.domainProfileModel.save(entity);
    } else {
      return await this.domainProfileModel.save({ textRecords, txHash, id: found.id });
    }
  }

  public async getProfile(name: string): Promise<DomainProfileEntity | null> {
    return await this.domainProfileModel.findOne({ where: { name } });
  }

  public async update(entity: DomainEntity) {
    return await this.domainModel.save({ ...entity });
  }

  public async getDomainsWithPagination(pagination: QueryPagination, subdomain: boolean = false): Promise<[DomainEntity[], number]> {
    const paginatedResult = await this.domainModel.findAndCount({
      where: {
        isSubdomain: subdomain,
      },
      skip: PaginationUtils.getSkipCount(pagination.page, pagination.size),
      take: PaginationUtils.getLimitCount(pagination.size),
      order: {
        id: 'DESC',
      },
    });

    return paginatedResult;
  }

  public async getDomainByTxHash(txHash: string): Promise<DomainEntity | null> {
    const entity = await this.domainModel.findOneBy({ txHash });
    return entity;
  }

  public async getDomainByName(name: string): Promise<DomainEntity | null> {
    const entity = await this.domainModel.findOneBy({ name });
    return entity;
  }

  public async getDomainByOwnerAddress(ownerAddress: string, isSubdomain: boolean, pagination: QueryPagination): Promise<[DomainEntity[], number]> {
    const paginatedResult = await this.domainModel.findAndCount({
      where: { ownerAddress, isSubdomain: isSubdomain },
      skip: PaginationUtils.getSkipCount(pagination.page, pagination.size),
      take: PaginationUtils.getLimitCount(pagination.size),
    });

    return paginatedResult;
  }

  public async deleteSubDomainById(id: number) {
    return await this.domainModel.delete(id);
  }

  public async getSubdomainsForDomainWithPagination(domainName: string, pagination: QueryPagination): Promise<[DomainEntity[], number]> {
    const paginatedResult = await this.domainModel.findAndCount({
      where: { name: Like(`%.${domainName}`) },
      skip: PaginationUtils.getSkipCount(pagination.page, pagination.size),
      take: PaginationUtils.getLimitCount(pagination.size),
    });
    return paginatedResult;
  }

  public async getAllSubdomainsForDomain(domainName: string): Promise<DomainEntity[]> {
    const domains = await this.domainModel.find({ where: { name: Like(`%.${domainName}`) } });
    return domains;
  }

  public async getDomainHasPrimaryAddress(ownerAddress: string): Promise<DomainEntity | null> {
    return await this.domainModel.findOne({ where: { ownerAddress, primaryAddress: Not(IsNull()) } });
  }
}
