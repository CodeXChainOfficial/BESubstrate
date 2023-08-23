import { Module } from '@nestjs/common';
import { DynamicModuleUtils } from '../utils/dynamic.module.utils';
import { DomainController } from './domain/domain.controller';
import { EndpointsServicesModule } from './endpoints.services.module';
import { HealthCheckController } from './health-check/health.check.controller';

@Module({
  imports: [EndpointsServicesModule],
  providers: [DynamicModuleUtils.getNestJsApiConfigService()],
  controllers: [DomainController, HealthCheckController],
})
export class EndpointsControllersModule {}
