import { Module } from "@nestjs/common";
import { ApiConfigModule } from "../../common/api-config/api.config.module";
import { DynamicModuleUtils } from "../../utils/dynamic.module.utils";
import { DomainService } from "./domain.service";
import DomainRepository from "./domain.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import DomainEntity from "./entities/domain.entity";
import DomainProfileEntity from "./entities/domain-profile.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainEntity, DomainProfileEntity]),
    ApiConfigModule,
    DynamicModuleUtils.getCachingModule(),
    DynamicModuleUtils.getPostgresModule(),
  ],
  providers: [
    DomainService,
    DomainRepository,
  ],
  exports: [
    DomainService,
  ],
})
export class DomainModule { }
