import { Address } from '@multiversx/sdk-core/out';
import { Constants } from '@multiversx/sdk-nestjs';
import { Locker } from '@multiversx/sdk-nestjs-common';
import { CacheService } from '@multiversx/sdk-nestjs-cache';
import { TransactionProcessor } from '@multiversx/sdk-transaction-processor';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { ApiConfigService } from '../../common/api-config/api.config.service';
import { DomainService } from '../../endpoints/domain/domain.service';
import { RedisKeys } from '../../common/enum/redis.key';
import { base64Decode, hexDecode } from 'src/utils/util';
import DomainProfileOverviewDto from '../../endpoints/domain/dtos/domain-profile-overview.dto';
import DomainProfileSocialDto from '../../endpoints/domain/dtos/domain-profile-social.dto';
import DomainProfileWalletDto from '../../endpoints/domain/dtos/domain-profile-wallet.dto';

@Injectable()
export class TransactionProcessorService {
  private transactionProcessor: TransactionProcessor = new TransactionProcessor();
  private readonly logger: Logger;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly cacheService: CacheService,
    private readonly domainService: DomainService,
  ) {
    this.logger = new Logger(TransactionProcessorService.name);
  }

  @Cron('*/5 * * * * *')
  async handleNewTransactions() {
    const contractAddress = this.apiConfigService.getContractAddress();
    const gatewayUrl = this.apiConfigService.getApiUrl();
    await Locker.lock('newTransactions', async () => {
      const egldPrice = await this.cacheService.getRemote(RedisKeys.EGLD_PRICE);
      if (!egldPrice) {
        return;
      }

      const url = `${gatewayUrl}/accounts/${contractAddress}/transactions`;
      const lastTransactionTimeStamp = (await this.cacheService.getRemote(RedisKeys.LAST_TRANSACTION_TIME_STAMP)) || 0;
      const res = await axios.get(url, {
        params: {
          size: 10,
          after: lastTransactionTimeStamp,
          fields: 'data,receiver,sender,status,timestamp,txHash,function',
          order: 'asc',
        },
        withCredentials: false,
      });

      for (const item of res.data) {
        const { data, sender, txHash, timestamp, status, function: actionName } = item;

        try {
          await this.cacheService.setRemote(RedisKeys.LAST_TRANSACTION_TIME_STAMP, timestamp, Constants.oneMonth() * 6);

          if (status === 'fail') {
            continue;
          }

          const decodedData = base64Decode(data);
          const args = decodedData.split('@');

          // check for not inserting duplicate data
          const domain = await this.domainService.getDomainByTxHash(txHash);
          if (domain) {
            continue;
          }

          switch (actionName) {
            case 'register_domain':
              const domainName = hexDecode(args[4]);
              const timeDuration = Number(args[5]);
              await this.domainService.registerDomain(domainName, sender, sender, timestamp.toString(), timeDuration, txHash, false);
              break;
            case 'extend_domain':
              const domainNameExtend = hexDecode(args[10]);
              const timeDurationExtend = Number(args[11]);

              // check for extended domain
              const found = await this.domainService.getDomainByName(domainNameExtend);
              if (found) {
                await this.domainService.extendDomain(domainNameExtend, timestamp.toString(), timeDurationExtend, txHash);
              }
              break;
            case 'register_sub_domain':
              const subdomainName = hexDecode(args[10]);
              const accountSubdomain = Address.fromHex(args[11]);
              const ownerAddressSubdomain = accountSubdomain.bech32();
              await this.domainService.registerDomain(subdomainName, sender, ownerAddressSubdomain, timestamp.toString(), 0, txHash, true);
              break;
            case 'update_primary_address':
              const domain = hexDecode(args[6]);
              // const primaryAccount = Address.fromHex(args[7]);
              // const primaryAddress = primaryAccount.bech32();
              await this.domainService.updatePrimaryAddress(domain, sender);
              break;
            case 'remove_sub_domain':
              const subdomainNameForDelete = hexDecode(args[10]);
              await this.domainService.deleteSubdomainByName(subdomainNameForDelete);
              break;
            case 'transfer_domain':
              const transferDomainname = hexDecode(args[6]);
              const transferTo = Address.fromHex(args[7]);
              const transferToAddress = transferTo.bech32();
              await this.domainService.transferDomain(transferDomainname, sender, transferToAddress, txHash);
              break;
            case 'update_domain_overview':
              const domainNameUpdateOverview = hexDecode(args[6]);
              const username = hexDecode(args[7]);
              const avatar = hexDecode(args[8]);
              const location = hexDecode(args[9]);
              const website = hexDecode(args[10]);
              const shortbio = hexDecode(args[11]);
              const profile: DomainProfileOverviewDto = {
                username,
                avatar,
                location,
                website,
                shortbio,
                txHash,
              };
              await this.domainService.updateDomainProfileOverview(domainNameUpdateOverview, profile);
              break;
            case 'update_domain_socials':
              const domainNameUpdateSocial = hexDecode(args[6]);
              const telegram = hexDecode(args[7]);
              const discord = hexDecode(args[8]);
              const twitter = hexDecode(args[9]);
              const medium = hexDecode(args[10]);
              const facebook = hexDecode(args[11]);
              const otherLink = hexDecode(args[12]);

              const profileSocial: DomainProfileSocialDto = {
                telegram,
                discord,
                twitter,
                medium,
                facebook,
                otherLink,
                txHash,
              };
              await this.domainService.updateDomainProfileSocial(domainNameUpdateSocial, profileSocial);
              break;
            case 'update_domain_wallets':
              const domainNameUpdateWallet = hexDecode(args[6]);
              const walletEgld = hexDecode(args[7]);
              const walletBtc = hexDecode(args[8]);
              const walletEth = hexDecode(args[9]);

              const profileWallet: DomainProfileWalletDto = {
                walletEgld,
                walletBtc,
                walletEth,
                txHash,
              };
              await this.domainService.updateDomainProfileWallet(domainNameUpdateWallet, profileWallet);
              break;
            case 'update_domain_textrecord':
              const domainNameTextRecord = hexDecode(args[6]);

              const textRecords: { key: string; value: string }[] = [];

              for (let i = 7; i < args.length; i++) {
                const textvalue = hexDecode(args[i]).split('@');
                textRecords.push({
                  key: textvalue[0] ?? '',
                  value: textvalue[1] ?? '',
                });
              }
              await this.domainService.updateDomainProfileTextRecords(domainNameTextRecord, textRecords, txHash);
              break;
            default:
              break;
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  @Cron('*/5 * * * * *')
  async getEgldPrice() {
    await Locker.lock('getEgldPrice', async () => {
      const url = `https://api.multiversx.com/economics`;

      const res = await axios.get(url, {
        withCredentials: false,
      });

      const data = res.data.price;
      await this.cacheService.setRemote(RedisKeys.EGLD_PRICE, data, Constants.oneMonth() * 6);
    });
  }
}
