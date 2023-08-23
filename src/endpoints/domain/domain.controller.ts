import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {  ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DomainService } from './domain.service';
import DomainEntity from './entities/domain.entity';
import DomainDto from './dtos/domain.dto';
import { DomainType } from './enum/domain.type';
import ProfileDto from './dtos/profile.dto';
import SubdomainDto from './dtos/subdomain.dto';

@Controller()
@ApiTags('domains')
export class DomainController {
  constructor(private readonly domainService: DomainService) {}

  @Get('/domains')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of domains',
    type: DomainEntity,
    isArray: true,
  })
  @ApiQuery({ name: 'page', description: 'Numer of items to skip for the result set', required: false })
  @ApiQuery({ name: 'size', description: 'Number of items to retrieve', required: false })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: DomainType,
  })
  async getDomains(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(25), ParseIntPipe) size: number,
    @Query('type') type: DomainType,
  ) {
    const paginatedResult = await this.domainService.getDomainsWithPagination({ page, size }, type);
    return { data: paginatedResult[0], totalCount: paginatedResult[1] };
  }

  @Get('/domains/:name')
  @ApiResponse({
    status: 200,
    description: 'Returns one domain',
    type: DomainEntity,
  })
  @ApiParam({ name: 'name', description: 'Search by domain name', required: true })
  async getDomain(@Param('name') name: string): Promise<DomainDto> {
    const result = await this.domainService.getDomainDtoByName(name);
    return result;
  }

  @Get('/domains/:name/profile')
  @ApiResponse({
    status: 200,
    description: 'Get profile data for a domain',
    type: ProfileDto,
    isArray: true,
  })
  @ApiParam({ name: 'name', description: 'Name of domain', required: true })
  async getProfileForDomain(@Param('name') name: string) {
    return await this.domainService.getProfile(name);
  }

  @Get('/accounts/:address')
  @ApiResponse({
    status: 200,
    description: 'Returns a list of domains for an account',
    isArray: true,
  })
  @ApiParam({ name: 'address', description: 'address of user wallet', required: true })
  @ApiQuery({ name: 'page', description: 'Numer of items to skip for the result set', required: true })
  @ApiQuery({ name: 'size', description: 'Number of items to retrieve', required: true })
  @ApiQuery({
    name: 'type',
    required: true,
    enum: DomainType,
  })
  async getDomainByOwnerAddress(
    @Param('address') address: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(25), ParseIntPipe) size: number,
    @Query('type') type: DomainType,
  ) {
    const paginatedResult = await this.domainService.getDomainByOwnerAddress(address, type, { page, size });
    return { data: paginatedResult[0], totalCount: paginatedResult[1] };
  }

  @Get('/domain/:name/subdomain')
  @ApiResponse({
    status: 200,
    description: 'Returns a subdomain',
    type: SubdomainDto,
    isArray: true,
  })
  @ApiParam({ name: 'name', description: 'Domain name', required: true })
  @ApiQuery({ name: 'page', description: 'Numer of items to skip for the result set', required: true })
  @ApiQuery({ name: 'size', description: 'Number of items to retrieve', required: true })
  async getSubDomainForDomain(
    @Param('name') name: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(25), ParseIntPipe) size: number,
  ) {
    const paginatedResult = await this.domainService.getSubdomainsForDomainWithPagination(name, { page, size });
    return { data: paginatedResult[0], totalCount: paginatedResult[1] };
  }
}
