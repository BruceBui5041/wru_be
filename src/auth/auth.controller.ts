import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignUpValidationPipe } from './pipes/signup.pipe';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { SignUpCredentialDto } from './dto/signup-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe, SignUpValidationPipe)
  async signup(@Body() signUpCredentials: SignUpCredentialDto) {
    return this.authService.signUp(signUpCredentials);
  }

  @Post('/signin')
  async signin(@Body(ValidationPipe) authCredentials: SignInCredentialDto) {
    return this.authService.signIn(authCredentials);
  }

  @Post('/verify_token')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    return { result: 'Authorized' };
  }
}
