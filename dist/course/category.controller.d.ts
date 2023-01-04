import { UserDocument } from '@/user/schema/user.schema';
import { CategoryService } from './category.service';
import { CategoryFindAllDto } from './dto/category-find-all.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    createCourse(user: UserDocument): Promise<UserDocument>;
    findAll(query: CategoryFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
}
