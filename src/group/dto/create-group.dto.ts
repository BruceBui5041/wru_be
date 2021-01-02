import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateGroupDto {
  @Field()
  @IsString()
  @MaxLength(50, { message: `groupName.${'Group name must be lesser than 50 characters'}` })
  @MinLength(5, { message: `groupName.${'Group name must be more than 5 characters'}` })
  groupName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: `groupImageUrl.${'Image must be an URL'}` })
  groupImageUrl: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(256, { message: `groupName.${'Group name must be lesser than 50 characters'}` })
  description: string;
}
