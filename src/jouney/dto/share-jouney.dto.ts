import { Field, InputType } from '@nestjs/graphql';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class InputJouneyDto {
  @Field()
  jouneyId: string;

  @Field()
  userSharedId?: string;
}
