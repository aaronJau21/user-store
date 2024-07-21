import { Router } from 'express';
import { AuthController } from './controller';


export class AuthRoutes {

  public static get routes(): Router {
    const router = Router();

    const controller = new AuthController();

    router.post( '/login', controller.loginUser );
    router.post( '/register', controller.registerUser );
    router.get( '/validate-email/:token', controller.validateUser );

    return router;
  }

}