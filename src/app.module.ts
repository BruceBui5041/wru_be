import { Module, UnauthorizedException } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { GraphQLModule } from '@nestjs/graphql';
import { GroupModule } from './group/group.module';
import { JouneyModule } from './jouney/jouney.module';
import { MarkerModule } from './marker/marker.module';
import { InvitationModule } from './invitations/invitation.module';
import { JoinInRequestModule } from './join-in-request/join-in-request.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { FileModule } from './file/file.module';
import { PubSubModule } from './pub-sub/pub-sub.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtPayload } from './auth/jwt-payload.interface';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'admin'),
    // }),
    TypeOrmModule.forRoot(typeOrmConfig),
    // ConfigModule.forRoot({ envFilePath: [`.env.${process.env.STAGE}`] }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    //     return {
    //       type: 'mysql',
    //       synchronize: true,
    //       entities: [__dirname + '/../**/*.entity.{js,ts}'],
    //       migrations: ['migration/*.js'],
    //       cli: {
    //         migrationsDir: 'migration',
    //       },
    //       host: configService.get('DB_HOST'),
    //       port: parseInt(configService.get<string>('DB_PORT')),
    //       username: configService.get('DB_USERNAME'),
    //       password: configService.get('DB_PASSWORD'),
    //       database: configService.get('DB_NAME'),
    //       // entities: [__dirname + '/../**/*.entity.{js,ts}'],
    //     };
    //   },
    // }),
    GraphQLModule.forRoot({
      // autoSchemaFile: 'schema.gql',
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      /** To customize the subscriptions server (e.g., change the listener port) */
      subscriptions: {
        'graphql-ws': true,
        // get headers
        // onConnect: connectionParams => {
        //   // convert header keys to lowercase
        //   // get authToken from authorization header
        //   const authToken: string =
        //     'Authorization' in connectionParams && connectionParams.authorization.split(' ')[1];
        //   if (authToken) {
        //     // verify authToken/getJwtPayLoad
        //     const jwtPayload: JwtPayload = authService.getJwtPayLoad(authToken);
        //     // the user/jwtPayload object found will be available as context.currentUser/jwtPayload in your GraphQL resolvers
        //     return { currentUser: jwtPayload.username, jwtPayload, headers: connectionParams };
        //   }
        //   throw new UnauthorizedException('authToken must be provided');
        // },
      },
    }),
    AuthModule,
    GroupModule,
    JouneyModule,
    MarkerModule,
    InvitationModule,
    JoinInRequestModule,
    UserProfileModule,
    FileModule,
    PubSubModule,
  ],
})
export class AppModule {}
