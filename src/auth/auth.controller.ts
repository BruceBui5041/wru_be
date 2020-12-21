import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body(ValidationPipe) authCredentials: AuthCredentialDto) {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  async signin(@Body(ValidationPipe) authCredentials: AuthCredentialDto) {
    return this.authService.signIn(authCredentials);
  }

  @Post('/verify_token')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    return { result: 'Authorized' };
  }
}
