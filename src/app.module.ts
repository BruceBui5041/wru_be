import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { GraphQLModule } from '@nestjs/graphql';
import { GroupModule } from './group/group.module';
import { JouneyModule } from './jouney/jouney.module';
import { MarkerModule } from './marker/marker.module';
import { InvitationModule } from './invitations/invitation.module';
import { JoinInRequestModule } from './join-in-request/join-in-request.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot({
      // autoSchemaFile: 'schema.gql',
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      /** To customize the subscriptions server (e.g., change the listener port) */
      subscriptions: {
        keepAlive: 5000,
      },
    }),
    AuthModule,
    GroupModule,
    JouneyModule,
    MarkerModule,
    InvitationModule,
    JoinInRequestModule,
  ],
})
export class AppModule {}
