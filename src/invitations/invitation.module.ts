import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationResolver } from './invitation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationRepository } from './invitation.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/user/user.repository';
import { GroupRepository } from 'src/group/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationRepository, UserRepository, GroupRepository]), AuthModule],
  providers: [InvitationService, InvitationResolver],
})
export class InvitationModule {}
