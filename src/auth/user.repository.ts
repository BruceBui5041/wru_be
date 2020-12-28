import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { SignInCredentialDto } from './dto/signin-credential.dto';
import { User } from './user.entity';
import { v4 as uuid } from 'uuid';
import { SignUpCredentialDto } from './dto/signup-credential.dto';
import { UserGraphQLType } from './user.gql.type';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(signUpCredentialsDto: SignUpCredentialDto): Promise<void> {
    const { username, password } = signUpCredentialsDto;
    const salt = await bcrypt.genSalt();

    const user = new User();
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    user.salt = salt;
    user.uuid = uuid();

    try {
      await user.save();
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException(['Username already exists!']);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async validatePassword(authCredentialDto: SignInCredentialDto): Promise<User> {
    const { username, password } = authCredentialDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user;
    }
    return null;
  }

  async getPublicInfo(uuid: string): Promise<UserGraphQLType> {
    const user = await this.findOne({ uuid });
    return user ? user.getPublicInfomation() : null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
