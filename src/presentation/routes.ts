import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRouter } from './category/routes';


export class AppRoutes {

  public static get routes(): Router {
    const router = Router();

    router.use( '/api/auth', AuthRoutes.routes );
    router.use( '/api/category', CategoryRouter.routes );

    return router;
  }

}