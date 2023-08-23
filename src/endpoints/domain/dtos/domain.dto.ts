export default class DomainDto {
  name: string;
  sender?: string;
  ownerAddress?: string;
  timestamp?: string;
  duration?: number;
  expiresAt?: string;
  primaryAddress?: string;
  priceEgld: string;
  priceUsd: string;
  isAvailable?: boolean;
  isSubdomain?: boolean;
}
