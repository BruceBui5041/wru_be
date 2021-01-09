import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { SignUpCredentialDto } from './dto/signup-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: SignUpCredentialDto): Promise<{ accessToken: string }> {
    await this.userRepository.signUp(authCredentials);
    const { username, password } = authCredentials;
    /**
     * If user sign up success then auto sign in
     */
    const res = await this.signIn({ username, password });
    return res;
  }

  async signIn(authCrendentialsDto: SignInCredentialDto): Promise<{ accessToken: string }> {
    try {
      const user = await this.userRepository.validatePassword(authCrendentialsDto);
      if (!user?.username) throw new UnauthorizedException(['Invalid username or password']);

      const payload: JwtPayload = { uuid: user.uuid, username: user.username };
      const accessToken = await this.jwtService.sign(payload);
      await this.userRepository.update({ uuid: user.uuid }, { token: accessToken });
      return { accessToken };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async isMatchStoragedToken(sentToken: string): Promise<boolean> {
    const { uuid } = this.jwtService.verify(sentToken) as JwtPayload;
    if (uuid) {
      const user = await this.userRepository.findOne({ uuid: uuid });
      return user.token == sentToken;
    }
    return false;
  }

  async getUserProfile(user: User): Promise<User> {
    return user;
  }
}
