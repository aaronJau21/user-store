import { NextFunction, Request, Response } from 'express';
import { Jwt } from '../../config';
import { UserModel } from '../../data';
import { UserEntity } from '../../domain';

export class AuthMiddleware {

  static async validateJwt( req: Request, res: Response, next: NextFunction ) {

    const authorization = req.header( 'Authorization' );

    if ( !authorization ) return res.status( 401 ).json( { error: 'No token provided' } );
    if ( !authorization.startsWith( 'Bearer ' ) ) return res.status( 401 ).json( { error: 'Invalid Bearer Token' } );

    const token: string = authorization.split( ' ' ).at( 1 ) || '';

    try {

      const payload = await Jwt.validateToken<{ id: string; }>( token );
      if ( !payload ) return res.status( 401 ).json( { error: 'Invalid token' } );

      const user = await UserModel.findById( payload.id );
      if ( !user ) return res.status( 401 ).json( { error: 'Invalid Token - user' } );

      req.body.user = UserEntity.fromObject( user );

      next();



    } catch ( error ) {
      console.log( error );

      return res.status( 500 ).json( { error: 'Internal Server Error' } );
    }

  }

}