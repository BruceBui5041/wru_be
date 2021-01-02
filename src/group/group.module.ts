import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupResolver } from './group.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GroupRepository } from './group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository]), AuthModule],
  providers: [GroupService, GroupResolver],
})
export class GroupModule {}
