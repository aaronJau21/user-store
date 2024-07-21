import { Router } from 'express';
import { AuthRoutes } from './auth/routes';


export class AppRoutes {

  public static get routes(): Router {
    const router = Router();

    router.use( '/api/auth', AuthRoutes.routes );

    return router;
  }

}