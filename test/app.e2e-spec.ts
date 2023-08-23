import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PublicAppModule } from '../src/public.app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PublicAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    app.setGlobalPrefix('xnames');
  });

  describe('/hello (GET)', () => {
    it('should return hello string', async () => {
      return await request(app.getHttpServer()).get('/hello').expect(200).expect('hello');
    });
  });

  describe('/domains (GET)', () => {
    it('should return list of domains', async () => {
      const expected = {
        duration: expect.any(Number),
        expiresAt: expect.any(String),
        name: expect.any(String),
        ownerAddress: expect.any(String),
        priceEgld: expect.any(String),
        priceUsd: expect.any(String),
        primaryAddress: expect.any(String),
        sender: expect.any(String),
        timestamp: expect.any(String),
      };

      const response = await request(app.getHttpServer()).get('/domains');
      expect(response.status).toBe(200);
      expect(response.body.data[0]).toEqual(expect.objectContaining(expected));
    });
  });

  describe('/domains/:name (GET)', () => {
    it('should return a domain info when that domain does not exist', async () => {
      const expected = {
        name: expect.any(String),
        priceEgld: expect.any(String),
        priceUsd: expect.any(String),
        isAvailable: expect.any(Boolean),
        isSubdomain: expect.any(Boolean),
      };

      const domainName = '@@this_domain_does_not_exist@@';
      const response = await request(app.getHttpServer()).get(`/domains/${domainName}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(expected));
      expect(response.body.isAvailable).toEqual(true);
    });
  });

  describe('/domains/:name/profile (GET)', () => {
    it('should return a domain profile info', async () => {
      const expected = {
        name: expect.any(String),
        username: expect.any(String),
        avatar: expect.any(String),
        location: expect.any(String),
        website: expect.any(String),
        shortbio: expect.any(String),
        telegram: expect.any(String),
        medium: expect.any(String),
        discord: expect.any(String),
        twitter: expect.any(String),
        facebook: expect.any(String),
        otherLink: expect.any(String),
        textRecords: expect.any(String),
        walletEgld: expect.any(String),
        walletEth: expect.any(String),
        walletBtc: expect.any(String),
      };

      const domainName = 'domain-name';
      const response = await request(app.getHttpServer()).get(`/domains/${domainName}/profile`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(expected));
    });
  });

  describe('/account/:address (GET)', () => {
    it('should return a list of domains for an account', async () => {
      const expected = {
        name: expect.any(String),
        sender: expect.any(String),
        ownerAddress: expect.any(String),
        timestamp: expect.any(String),
        duration: expect.any(Number),
        expiresAt: expect.any(String),
        primaryAddress: expect.any(String),
        priceEgld: expect.any(String),
        priceUsd: expect.any(String),
      };

      //fetch an owner address
      const responseDomainList = await request(app.getHttpServer()).get('/domains');
      const address = responseDomainList.body.data[0].ownerAddress;

      const response = await request(app.getHttpServer()).get(`/accounts/${address}?page=1&size=10&type=domain`);
      expect(response.status).toBe(200);
      expect(response.body.totalCount).toBeGreaterThan(0);
      expect(response.body.data[0]).toEqual(expect.objectContaining(expected));
    });
  });
});
