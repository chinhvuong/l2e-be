import { CategoryService } from '@/course/category.service';
import { Injectable } from '@nestjs/common';
import { categories } from './data/category';
@Injectable()
export class SeedService {
  constructor(private readonly categoryService: CategoryService) {}

  async runSeeding() {
    return await Promise.all([
      this.categoryService.seedingCategory(categories),
    ]);
  }
}
