import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialDto): Promise<{ accessToken: string }> {
    await this.userRepository.signUp(authCredentials);
    const { username, password } = authCredentials;
    /**
     * If user sign up success then auto sign in
     */
    return this.signIn({ username, password });
  }

  async signIn(authCrendentialsDto: AuthCredentialDto): Promise<{ accessToken: string }> {
    const result = await this.userRepository.validatePassword(authCrendentialsDto);
    if (!result?.username) throw new UnauthorizedException(['Invalid username or password']);

    const payload: JwtPayload = { uuid: result.uuid, username: result.username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
