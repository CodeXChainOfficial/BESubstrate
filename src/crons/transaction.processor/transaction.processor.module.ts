import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiConfigModule } from '../../common/api-config/api.config.module';
import { DynamicModuleUtils } from '../../utils/dynamic.module.utils';
import { TransactionProcessorService } from './transaction.processor.service';
import { DomainModule } from '../../endpoints/domain/domain.module';

@Module({
  imports: [ScheduleModule.forRoot(), ApiConfigModule, DynamicModuleUtils.getCachingModule(), DomainModule],
  providers: [TransactionProcessorService],
})
export class TransactionProcessorModule {}
