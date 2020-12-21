import { IsString, Matches, MinLength } from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(6)
  username: string;

  @IsString()
  @MinLength(4)
  /**At least 1 upper 1 lower 1 special 1 number charater */
  // TODO: Need to enable when deploy production
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password is too weak' })
  password: string;
}
