import { SendMailOptions } from 'nodemailer';
import { BcryptAdapter, envs, Jwt } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';


export class AuthService {
  constructor(
    private readonly emailService: EmailService
  ) { }

  public async registerUser( registerUserDto: RegisterUserDto ) {
    const existUser = await UserModel.findOne( { email: registerUserDto.email } );
    if ( existUser ) throw CustomError.badRequest( 'Email alrady exist' );

    try {
      const user = new UserModel( registerUserDto );

      user.password = BcryptAdapter.hash( registerUserDto.password );

      await user.save();

      await this.sendEmailValidationLink( user.email );

      const { password, ...rest } = UserEntity.fromObject( user );

      const token = await Jwt.generateToken( { id: user.id, email: user.email } );
      if ( !token ) throw CustomError.internalServerError( 'Error while creating JWT' );

      return {
        user: rest,
        token: token
      };

    } catch ( error ) {
      throw CustomError.internalServerError( `${ error }` );
    }


  }

  public async loginUser( loginUserDto: LoginUserDto ) {
    const userExist = await UserModel.findOne( { email: loginUserDto.email } );
    if ( !userExist ) throw CustomError.notFound( 'Not exist User' );

    const pwd = BcryptAdapter.compare( loginUserDto.password, userExist.password );
    if ( !pwd ) throw CustomError.notFound( 'Not exist User' );

    const { password, ...rest } = UserEntity.fromObject( userExist );

    const token = await Jwt.generateToken( { id: userExist.id, email: userExist.email } );

    if ( !token ) throw CustomError.internalServerError( 'Error while creating JWT' );

    return {
      user: rest,
      token: token
    };
  }

  private sendEmailValidationLink = async ( email: string ) => {
    const token = await Jwt.generateToken( { email } );
    if ( !token ) throw CustomError.internalServerError( 'Error getting token' );

    const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
    const html = `
    
    <h1>Validate your email</h1>
    <p>Click on the following to validate your email</p>
    <a href="${ link }">Validate your email: ${ email }</a>

    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html
    };

    const isSet = await this.emailService.sendEmail( options );

    if ( !isSet ) throw CustomError.internalServerError( 'Error sending email' );

    return true;

  };

  async validateEmail( token: string ) {

    const payload = await Jwt.validateToken( token );
    if ( !payload ) throw CustomError.unAuthorized( 'Invalid token' );

    const { email } = payload as { email: string; };
    if ( !email ) throw CustomError.internalServerError( 'Email not in token' );

    const user = await UserModel.findOne( { email } );
    if ( !user ) throw CustomError.internalServerError( 'Email not exists' );

    user.emilValidated = true;
    await user.save();

    return true;

  }

}

