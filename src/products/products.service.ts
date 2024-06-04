import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/shared/dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create( { data: createProductDto } )
  }

  async findAll( paginationDto: PaginationDto ) {
    const { page, limit } = paginationDto;
    const total = await this.product.count({ where: { isAvailable: true }});
    const pages = Math.round( total / limit)
    if( page > pages )  throw  new BadRequestException('Page out of bounds')
    const data = await this.product.findMany({
      where: { isAvailable: true },
      skip: (page - 1) * limit,
      take: limit
    })
    return { data, meta: { total, pages ,page, limit }}
  }

  async findOne(id: number) {
    if( isNaN(id) ) throw new BadRequestException('Id must be a number')
    const product = await this.product.findUnique({ where: { id, isAvailable: true  } });
    if( !product ) throw new NotFoundException(`Product with id ${id} not found`)
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id)
    return this.product.update({ where: { id } , data: updateProductDto })
  }

  async remove(id: number) {
    await this.findOne(id)
    //return this.product.delete({ where: { id } })
    return this.product.update({ where: { id }, data: { isAvailable: false  } })
  }
}
