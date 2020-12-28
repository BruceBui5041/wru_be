import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { SignUpCredentialDto } from './dto/signup-credential.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserGraphQLType } from './user.gql.type';
import { UserRepository } from './user.repository';

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
    return this.signIn({ username, password });
  }

  async signIn(authCrendentialsDto: SignInCredentialDto): Promise<{ accessToken: string }> {
    const result = await this.userRepository.validatePassword(authCrendentialsDto);
    if (!result?.username) throw new UnauthorizedException(['Invalid username or password']);

    const payload: JwtPayload = { uuid: result.uuid, username: result.username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }

  async getUserInfoByUUID(userUUID: string): Promise<UserGraphQLType> {
    const result = await this.userRepository.getPublicInfo(userUUID);
    if (!result) throw new NotFoundException();
    return result;
  }

  async parseTokenToInfomation(token: string): Promise<JwtPayload> {
    const payload: JwtPayload = await this.jwtService.verify(token);
    return payload;
  }
}
