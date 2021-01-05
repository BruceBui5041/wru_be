import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationResolver } from './invitation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationRepository } from './invitation.repository';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/user.repository';
import { GroupRepository } from '../group/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationRepository, UserRepository, GroupRepository]), AuthModule],
  providers: [InvitationService, InvitationResolver],
})
export class InvitationModule {}
