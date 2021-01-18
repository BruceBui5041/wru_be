import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PubSubProvider } from '../constants';

@Global()
@Module({
  providers: [
    {
      provide: PubSubProvider,
      //   useClass: PubSub,
      useValue: new PubSub(),
      // useFactory: () => {
      //  return new PubSub();
      // }
    },
  ],
  exports: [PubSubProvider],
})
export class PubSubModule {}
