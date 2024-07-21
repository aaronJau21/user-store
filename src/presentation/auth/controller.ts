import { Request, Response } from 'express';

export class AuthController {

  constructor() { }

  registerUser = ( req: Request, res: Response ) => {
    res.json( 'register User' );
  };

  loginUser = ( req: Request, res: Response ) => {
    res.json( 'login User' );
  };

  validateUser = ( req: Request, res: Response ) => {
    res.json( 'Validate User' );
  };

}