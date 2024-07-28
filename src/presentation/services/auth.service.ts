import { BcryptAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, RegisterUserDto, UserEntity } from '../../domain';


export class AuthService {
  constructor() { }

  public async registerUser( registerUserDto: RegisterUserDto ) {
    const existUser = await UserModel.findOne( { email: registerUserDto.email } );
    if ( existUser ) throw CustomError.badRequest( 'Email alrady exist' );

    try {
      const user = new UserModel( registerUserDto );

      user.password = BcryptAdapter.hash( registerUserDto.password );

      await user.save();

      const { password, ...rest } = UserEntity.fromObject( user );

      return {
        user: rest,
        token: 'ABC'
      };

    } catch ( error ) {
      throw CustomError.internalServerError( `${ error }` );
    }


  }

}

