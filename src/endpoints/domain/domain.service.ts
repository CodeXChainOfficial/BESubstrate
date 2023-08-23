import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryPagination } from '../../common/entities/query.paginations';
import DomainRepository from './domain.repository';
import DomainEntity from './entities/domain.entity';
import { extendDomain, getDomainPrice } from '../../utils/util';
import { mapToDomainDto, mapToArrayDomainDto, mapToDomainIsNotAvailableDto, mapToArraySubdomainDto, mapToProfileDto } from './mapper';
import DomainDto from './dtos/domain.dto';
import DomainAccountDto from './dtos/domain-account.dto';
import ProfileDto from './dtos/profile.dto';
import { DomainType } from './enum/domain.type';
import DomainProfileOverviewDto from './dtos/domain-profile-overview.dto';
import DomainProfileSocialDto from './dtos/domain-profile-social.dto';
import DomainProfileWalletDto from './dtos/domain-profile-wallet.dto';
import { CacheService } from '@multiversx/sdk-nestjs-cache';
import { RedisKeys } from '../../common/enum/redis.key';

@Injectable()
export class DomainService {
  constructor(private readonly domainRepository: DomainRepository, private readonly cacheService: CacheService) {}

  public async getDomainsWithPagination(pagination: QueryPagination, type: DomainType): Promise<[DomainDto[], number]> {
    const subdomain = type === DomainType.subdomain ? true : false;
    const paginatedResult = await this.domainRepository.getDomainsWithPagination(pagination, subdomain);
    return [mapToArrayDomainDto(paginatedResult[0]), paginatedResult[1]];
  }

  async registerDomain(
    name: string,
    sender: string,
    ownerAddress: string,
    timestamp: string,
    duration: number,
    txHash: string,
    isSubdomain: boolean,
  ) {
    const egldPrice = await this.cacheService.getRemote(RedisKeys.EGLD_PRICE) || 0;
    const expireAt = extendDomain(Number(timestamp), duration);
    const { priceEgld, priceUsd } = getDomainPrice(name, egldPrice);
    return await this.domainRepository.createDomain(
      name,
      sender,
      ownerAddress,
      timestamp,
      duration,
      txHash,
      expireAt,
      priceEgld.toString(),
      priceUsd.toString(),
      isSubdomain,
    );
  }

  async getProfile(name: string): Promise<ProfileDto> {
    const profile = await this.domainRepository.getProfile(name);
    return mapToProfileDto(profile);
  }

  async extendDomain(name: string, timestamp: string, duration: number, txHash: string) {
    const domain = await this.domainRepository.getDomainByName(name);
    if (!domain) {
      return;
    }

    const expiresAt = extendDomain(Number(domain.expiresAt), duration);

    await this.domainRepository.update({
      ...domain,
      timestamp,
      duration,
      expiresAt,
      txHash,
    });
  }

  async updatePrimaryAddress(name: string, primaryAddress: string) {
    const domain = await this.domainRepository.getDomainByName(name);
    if (!domain) {
      return;
    }

    //find old domain that have primary address to update
    const oldDomain = await this.getDomainHasPrimaryAddress(domain.ownerAddress);
    if (oldDomain) {
      await this.domainRepository.update({
        ...oldDomain,
        primaryAddress: null,
      });
    }

    return await this.domainRepository.update({
      ...domain,
      primaryAddress,
    });
  }

  public async getDomainByTxHash(txHash: string): Promise<DomainEntity | null> {
    return await this.domainRepository.getDomainByTxHash(txHash);
  }

  public async getDomainByName(name: string): Promise<DomainEntity | null> {
    return await this.domainRepository.getDomainByName(name);
  }

  public async getDomainDtoByName(name: string): Promise<DomainDto> {
    const domain = await this.domainRepository.getDomainByName(name);

    if (!domain) {
      const egldPrice = (await this.cacheService.getRemote(RedisKeys.EGLD_PRICE)) || 0;
      const { priceEgld, priceUsd } = getDomainPrice(name, egldPrice);
      return mapToDomainIsNotAvailableDto(name, priceEgld.toString(), priceUsd.toString());
    }

    return mapToDomainDto(domain);
  }

  public async getDomainByOwnerAddress(ownerAddress: string, type: DomainType, pagination: QueryPagination): Promise<[DomainAccountDto[], number]> {
    const isSubdomain = type === DomainType.subdomain ? true : false;
    const paginatedResult = await this.domainRepository.getDomainByOwnerAddress(ownerAddress, isSubdomain, pagination);
    return [mapToArrayDomainDto(paginatedResult[0]), paginatedResult[1]];
  }

  public async deleteSubdomainByName(name: string) {
    const domain = await this.domainRepository.getDomainByName(name);
    if (!domain) {
      return;
    }

    return await this.domainRepository.deleteSubDomainById(domain.id);
  }

  async getSubdomainsForDomainWithPagination(name: string, pagination: QueryPagination) {
    const paginatedResult = await this.domainRepository.getSubdomainsForDomainWithPagination(name, pagination);
    return [mapToArraySubdomainDto(paginatedResult[0]), paginatedResult[1]];
  }

  async transferDomain(name: string, sender: string, newOwner: string, txHash: string) {
    const domain = await this.domainRepository.getDomainByName(name);
    if (!domain) {
      return;
    }
    await this.domainRepository.update({
      ...domain,
      ownerAddress: newOwner,
      sender,
      txHash,
    });

    //remove all subdomains
    const subdomains = await this.domainRepository.getAllSubdomainsForDomain(name);
    const promises = subdomains.map(async (subdomain) => {
      await this.deleteSubdomainByName(subdomain.name);
    });

    await Promise.all(promises);
  }

  public async getDomainHasPrimaryAddress(ownerAddress: string): Promise<DomainEntity | null> {
    return await this.domainRepository.getDomainHasPrimaryAddress(ownerAddress);
  }

  async updateDomainProfileOverview(name: string, profile: DomainProfileOverviewDto) {
    const entity = await this.domainRepository.UpdateDomainProfileOverview(name, profile);
    return entity;
  }

  async updateDomainProfileSocial(name: string, profile: DomainProfileSocialDto) {
    const entity = await this.domainRepository.UpdateDomainProfileSocial(name, profile);
    return entity;
  }

  async updateDomainProfileWallet(name: string, profile: DomainProfileWalletDto) {
    const entity = await this.domainRepository.UpdateDomainProfileWallet(name, profile);
    return entity;
  }

  async updateDomainProfileTextRecords(name: string, textRecords: any, txHash:string) {
    const entity = await this.domainRepository.UpdateDomainProfileTextRecords(name, textRecords, txHash);
    return entity;
  }
}
