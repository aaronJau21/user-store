import bcrypt, { hashSync } from 'bcryptjs';

export class BcryptAdapter {

  public static hash( password: string ) {
    const salt = bcrypt.genSaltSync();
    return hashSync( password, salt );
  };

  public static compare( password: string, hashed: string ) {
    return bcrypt.compareSync( password, hashed );
  }

}