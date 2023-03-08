import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { isNumber } from 'class-validator';

import { Product } from '../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductDto,
} from '../dtos/product.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  findAll(params?: FilterProductDto) {
    if (params) {
      const { limit, offset, getArchive } = params;
      return this.productRepo.find({
        order: { id: 'DESC' },
        take: limit,
        skip: offset,
        where: { archive: getArchive },
      });
    }
    return this.productRepo.find({
      order: { id: 'DESC' },
    });
  }

  findOne(productId: number) {
    const product = this.productRepo.findOne({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }
    return product;
  }

  getCount(getArchive: boolean) {
    return this.productRepo.count({
      where: { archive: getArchive },
    });
  }

  async search(searchInput: string, getArchive: boolean) {
    if (isNumber(Number(searchInput))) {
      return this.productRepo.find({
        where: [{ id: Number(searchInput), archive: getArchive }],
        take: 10,
      });
    } else {
      return this.productRepo.find({
        where: [
          {
            name: ILike(`%${searchInput}%`),
            archive: getArchive,
          },
        ],
        take: 20,
      });
    }
  }

  create(data: CreateProductDto) {
    const newProduct = this.productRepo.create(data);
    return this.productRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this.findOne(id);
    this.productRepo.merge(product, changes);
    return this.productRepo.save(product);
  }

  async archive(id: number) {
    const product = await this.findOne(id);
    product.archive = !product.archive;
    return this.productRepo.save(product);
  }
}
