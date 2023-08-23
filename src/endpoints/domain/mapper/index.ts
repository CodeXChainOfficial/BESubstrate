import DomainAccountDto from '../dtos/domain-account.dto';
import DomainDto from '../dtos/domain.dto';
import ProfileDto from '../dtos/profile.dto';
import SubdomainDto from '../dtos/subdomain.dto';
import DomainProfileEntity from '../entities/domain-profile.entity';
import DomainEntity from '../entities/domain.entity';

export const mapToDomainDto = (entity: DomainEntity): DomainDto => {
  return {
    name: entity.name,
    sender: entity.sender,
    ownerAddress: entity.ownerAddress,
    timestamp: entity.timestamp,
    duration: entity.duration,
    expiresAt: entity.expiresAt,
    primaryAddress: entity.primaryAddress || "",
    priceEgld: entity.priceEgld,
    priceUsd: entity.priceUsd,
    isAvailable: false,
    isSubdomain: entity.isSubdomain,
  };
};

export const mapToArrayDomainDto = (entity: DomainEntity[]): DomainAccountDto[] => {
  return entity.map((item) => {
    return {
      name: item.name,
      sender: item.sender,
      ownerAddress: item.ownerAddress,
      timestamp: item.timestamp,
      duration: item.duration,
      expiresAt: item.expiresAt,
      primaryAddress: item.primaryAddress || '',
      priceEgld: item.priceEgld,
      priceUsd: item.priceUsd,
    };
  });
};

export const mapToDomainIsNotAvailableDto = (name: string, priceEgld: string, priceUsd: string): DomainDto => {
  return {
    name,
    priceEgld,
    priceUsd,
    isAvailable: true,
    isSubdomain: false,
  };
};

export const mapToArraySubdomainDto = (entity: DomainEntity[]): SubdomainDto[] => {
  return entity.map((item) => {
    return {
      name: item.name,
      expiresAt: item.expiresAt,
    };
  });
};

export const mapToProfileDto = (entity: DomainProfileEntity | null): ProfileDto => {
  return {
    name: entity?.name || '',
    username: entity?.username || '',
    avatar: entity?.avatar || '',
    location: entity?.location || '',
    website: entity?.website || '',
    shortbio: entity?.shortbio || '',
    telegram: entity?.telegram || '',
    medium: entity?.medium || '',
    discord: entity?.discord || '',
    twitter: entity?.twitter || '',
    facebook: entity?.facebook || '',
    otherLink: entity?.otherLink || '',
    textRecords: entity?.textRecords || [],
    walletEgld: entity?.walletEgld || '',
    walletEth: entity?.walletEth || '',
    walletBtc: entity?.walletBtc || '',
  };
};
