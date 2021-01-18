import { Field, InputType } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';

@InputType()
export class UpdateProfileDto {
  @Field({ nullable: true, defaultValue: null })
  phoneNumber: string;

  @Field({ nullable: true, defaultValue: null })
  @IsUrl()
  avatarUrl: string;

  @Field({ nullable: true, defaultValue: null })
  status: string;

  @Field({ nullable: true, defaultValue: null })
  placesWantToGoTo: string;
}
