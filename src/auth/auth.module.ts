import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from '../user/user.repository';
import { UserResolver } from '../user/user.resolver';
import { UserProfileRepository } from '../user-profile/user-profile.repository';
import { UserService } from '../user/user.service';
import { UserProfileService } from '../user-profile/user-profile.service';

@Module({
  imports: [
    JwtModule.register({
      // TODO: need to put this into enviroment variables
      secret: 'mysecret41',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRepository, UserProfileRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserResolver, UserService, UserProfileService],
  exports: [JwtStrategy, PassportModule, AuthService, UserService],
})
export class AuthModule {}
