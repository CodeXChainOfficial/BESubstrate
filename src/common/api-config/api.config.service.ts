import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  getRequiredConfig = <T>(path: string) => {
    const config = this.configService.get<T>(path);
    if (config == null) {
      throw new Error(`No ${path} present`);
    }

    return config;
  };

  getApiUrl(): string {
    return this.getRequiredConfig<string>('urls.api');
  }

  getSwaggerUrls(): string[] {
    return this.getRequiredConfig<string[]>('urls.swagger');
  }

  getNoSQLDatabaseConnection(): string {
    return this.getRequiredConfig<string>('urls.mongodb');
  }

  getRedisUrl(): string {
    const redisUrl = this.configService.get<string>('urls.redis');
    if (!redisUrl) {
      throw new Error('No redisUrl present');
    }

    return redisUrl;
  }

  getRedisName(): string {
    return this.getRequiredConfig<string>('redis.name');
  }

  getRedisHost(): string {
    return this.getRequiredConfig<string>('redis.host');
  }

  getRedisPort(): number {
    return this.getRequiredConfig<number>('redis.port');
  }

  getRedisUsername(): string {
    return this.configService.get<string>('redis.username') || '';
  }

  getRedisPassword(): string {
    return this.configService.get<string>('redis.password') || '';
  }

  getRedisConnection() {
    return {
      host: this.getRedisHost(),
      port: this.getRedisPort(),
      username: this.getRedisUsername(),
      password: this.getRedisPassword(),
    };
  }

  // getRedisUrl(): string {
  //   const creds = this.getRedisUsername() && this.getRedisPassword() ? `${this.getRedisUsername()}:${this.getRedisPassword()}@` : '';
  //   return `redis://${creds}${this.getRedisHost()}:${this.getRedisPort()}`;
  // }

  getPostgresHost(): string {
    return this.getRequiredConfig<string>('postgres.host');
  }

  getPostgresPort(): number {
    return this.getRequiredConfig<number>('postgres.port');
  }

  getPostgresDatabase(): string {
    return this.getRequiredConfig<string>('postgres.database');
  }

  getPostgresUserName(): string {
    return this.getRequiredConfig<string>('postgres.username');
  }

  getPostgresPassword(): string {
    return this.getRequiredConfig<string>('postgres.password');
  }

  getIsPublicApiFeatureActive(): boolean {
    return this.getRequiredConfig<boolean>('features.publicApi.enabled');
  }

  getPublicApiFeaturePort(): number {
    return this.getRequiredConfig<number>('features.publicApi.port');
  }

  getIsPrivateApiFeatureActive(): boolean {
    return this.getRequiredConfig<boolean>('features.privateApi.enabled');
  }

  getPrivateApiFeaturePort(): number {
    return this.getRequiredConfig<number>('features.privateApi.port');
  }

  getIsCacheWarmerFeatureActive(): boolean {
    return this.getRequiredConfig<boolean>('features.cacheWarmer.enabled');
  }

  getCacheWarmerFeaturePort(): number {
    return this.getRequiredConfig<number>('features.cacheWarmer.port');
  }

  getIsTransactionProcessorFeatureActive(): boolean {
    return this.getRequiredConfig<boolean>('features.transactionProcessor.enabled');
  }

  getTransactionProcessorFeaturePort(): number {
    return this.getRequiredConfig<number>('features.transactionProcessor.port');
  }

  getTransactionProcessorMaxLookBehind(): number {
    return this.getRequiredConfig<number>('features.transactionProcessor.maxLookBehind');
  }

  getQueueWorkerFeaturePort(): number {
    return this.getRequiredConfig<number>('features.queueWorker.port');
  }

  getSecurityAdmins(): string[] {
    return this.getRequiredConfig<[]>('security.admins');
  }

  getRateLimiterSecret(): string | undefined {
    return this.configService.get<string>('rateLimiterSecret');
  }

  getAxiosTimeout(): number {
    return this.configService.get<number>('keepAliveTimeout.downstream') ?? 61000;
  }

  getIsKeepAliveAgentFeatureActive(): boolean {
    return this.configService.get<boolean>('keepAliveAgent.enabled') ?? true;
  }

  getServerTimeout(): number {
    return this.configService.get<number>('keepAliveTimeout.upstream') ?? 60000;
  }

  getHeadersTimeout(): number {
    return this.getServerTimeout() + 1000;
  }

  getUseCachingInterceptor(): boolean {
    return this.configService.get<boolean>('useCachingInterceptor') ?? false;
  }

  getContractAddress(): string {
    return this.getRequiredConfig<string>('contractAddress');
  }

  getElasticUrl(): string {
    const elasticUrls = this.getRequiredConfig<string[]>('urls.elastic');
    return elasticUrls[Math.floor(Math.random() * elasticUrls.length)];
  }

  getPoolLimit(): number {
    return this.configService.get<number>('caching.poolLimit') ?? 100;
  }

  getProcessTtl(): number {
    return this.configService.get<number>('caching.processTtl') ?? 60;
  }

  getUseKeepAliveAgentFlag(): boolean {
    return this.configService.get<boolean>('flags.useKeepAliveAgent') ?? true;
  }

  getIsAuthActive(): boolean {
    return this.configService.get<boolean>('api.auth') ?? false;
  }

  getNativeAuthMaxExpirySeconds(): number {
    return this.configService.get<number>('nativeAuth.maxExpirySeconds') ?? 86400;
  }

  getNativeAuthAcceptedOrigins(): string[] {
    return this.configService.get<string[]>('nativeAuth.acceptedOrigins') ?? [];
  }
}
