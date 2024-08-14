import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryServices } from '../services/category.service';


export class CategoryRouter {

  public static get routes(): Router {


    const router = Router();
    const category = new CategoryServices;
    const controller = new CategoryController( category );

    router.get( '/', controller.getCategories );
    router.post( '/', [ AuthMiddleware.validateJwt ], controller.createCategory );

    return router;

  }

};