import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { JouneyVisibility } from '../jouney.enum';

registerEnumType(JouneyVisibility, {
  name: 'JouneyVisibility',
  description: 'Determine the visibility of an jouney',
});

@InputType()
export class InputJouneyDto {
  @Field()
  @IsString()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image?: string;

  @Field(type => JouneyVisibility, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(JouneyVisibility))
  visibility: JouneyVisibility = JouneyVisibility.PRIVATE;
}
