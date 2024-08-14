import { CategoryModel } from '../../data';
import { CustomError, PaginationDto, UserEntity } from '../../domain';
import { CreateCategoryDto } from '../../domain/dtos/category/create-category.dto';

export class CategoryServices {

  constructor() { }

  async createCategory( createCategoryDto: CreateCategoryDto, user: UserEntity ) {

    const categoryExists = await CategoryModel.findOne( { name: createCategoryDto.name } );

    if ( categoryExists ) throw CustomError.badRequest( 'Category already Exists' );

    try {

      const category = new CategoryModel( {
        ...createCategoryDto,
        user: user.id,
      } );

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,

      };

    } catch ( error ) {

      throw CustomError.internalServerError( `${ error }` );
    }

  }

  async getCategories( paginationDto: PaginationDto ) {

    const { page, limit } = paginationDto;

    try {

      const [ total, categories ] = await Promise.all( [
        CategoryModel.countDocuments(),
        CategoryModel.find().skip( ( page - 1 ) * limit ).limit( limit ).select( 'id name available' )
      ] );
      // const total = await CategoryModel.countDocuments();
      // const categories = await CategoryModel.find().skip( ( page - 1 ) * limit ).limit( limit ).select( 'id name available' );
      return {
        page: +page,
        limit: +limit,
        total,
        categories,
      };
    } catch ( error ) {
      throw CustomError.internalServerError( `${ error }` );
    }

  }


}