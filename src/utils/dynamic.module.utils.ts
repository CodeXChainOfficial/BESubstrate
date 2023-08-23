import {
  ApiModule,
  ApiModuleOptions,
  ERDNEST_CONFIG_SERVICE,
  ElasticModule,
  ElasticModuleOptions,
} from '@multiversx/sdk-nestjs';
import { CacheModule, RedisCacheModuleOptions } from "@multiversx/sdk-nestjs-cache";
import {  DynamicModule, Provider } from '@nestjs/common';
import { ClientOptions, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigModule } from '../common/api-config/api.config.module';
import { ApiConfigService } from '../common/api-config/api.config.service';
import { SdkNestjsConfigServiceImpl } from '../common/api-config/sdk.nestjs.config.service.impl';
import DomainEntity from '../endpoints/domain/entities/domain.entity';

export class DynamicModuleUtils {
  static getPostgresModule(): DynamicModule {
    return TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (configService: ApiConfigService) => ({
        type: 'postgres',
        host: configService.getPostgresHost(),
        port: configService.getPostgresPort(),
        username: configService.getPostgresUserName(),
        password: configService.getPostgresPassword(),
        database: configService.getPostgresDatabase(),
        autoLoadEntities: true,
        synchronize: true,
        // ssl: {
        //   rejectUnauthorized: false,
        // },
        entities: [DomainEntity],
      }),
      inject: [ApiConfigService],
    });
  }

  static getElasticModule(): DynamicModule {
    return ElasticModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) =>
        new ElasticModuleOptions({
          url: apiConfigService.getElasticUrl(),
          customValuePrefix: 'api',
        }),
      inject: [ApiConfigService],
    });
  }

  // static getCachingModule(): DynamicModule {
  //   return RedisCacheModule.forRootAsync({
  //     imports: [ApiConfigModule],
  //     useFactory: (apiConfigService: ApiConfigService) =>
  //       new RedisCacheModuleOptions({
  //         url: apiConfigService.getRedisHost(),
  //         ...apiConfigService.getRedisConnection(),
  //         processTtl: apiConfigService.getProcessTtl(),
        
  //       }),
  //     inject: [ApiConfigService],
  //   });
  // }

  static getCachingModule(): DynamicModule {
    return CacheModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) => new RedisCacheModuleOptions({
        name : apiConfigService.getRedisName(),
        host: apiConfigService.getRedisHost(),
        port: apiConfigService.getRedisPort(),
      }, {
        poolLimit: apiConfigService.getPoolLimit(),
        processTtl: apiConfigService.getProcessTtl(),
      }),
      inject: [ApiConfigService],
    });
  }


  static getApiModule(): DynamicModule {
    return ApiModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) =>
        new ApiModuleOptions({
          axiosTimeout: apiConfigService.getAxiosTimeout(),
          rateLimiterSecret: apiConfigService.getRateLimiterSecret(),
          serverTimeout: apiConfigService.getServerTimeout(),
          useKeepAliveAgent: apiConfigService.getUseKeepAliveAgentFlag(),
        }),
      inject: [ApiConfigService],
    });
  }

  static getNestJsApiConfigService(): Provider {
    return {
      provide: ERDNEST_CONFIG_SERVICE,
      useClass: SdkNestjsConfigServiceImpl,
    };
  }

  static getPubSubService(): Provider {
    return {
      provide: 'PUBSUB_SERVICE',
      useFactory: (apiConfigService: ApiConfigService) => {
        const clientOptions: ClientOptions = {
          transport: Transport.REDIS,
          options: {
            ...apiConfigService.getRedisConnection(),
            retryDelay: 1000,
            retryAttempts: 10,
            retryStrategy: () => 1000,
          },
        };

        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ApiConfigService],
    };
  }
}
