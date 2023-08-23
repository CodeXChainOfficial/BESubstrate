import { Module } from '@nestjs/common';
import { HealthCheckController } from './endpoints/health-check/health.check.controller';
import { CacheController } from './endpoints/caching/cache.controller';
import { DynamicModuleUtils } from './utils/dynamic.module.utils';
import { LoggingModule } from '@multiversx/sdk-nestjs';

@Module({
  imports: [
    DynamicModuleUtils.getCachingModule(),
    DynamicModuleUtils.getPostgresModule(),
    LoggingModule,
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService(),
    DynamicModuleUtils.getPubSubService(),
  ],
  controllers: [
    CacheController,
    HealthCheckController,
  ],
})
export class PrivateAppModule { }
