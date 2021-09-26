import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { MarkerVisibility } from '../marker.enum';

registerEnumType(MarkerVisibility, {
  name: 'MarkerVisibility',
  description: 'Determine the visibility of an marker',
});

@InputType()
export class UpdateMarkerDto {
  @Field({ nullable: true })
  @IsOptional()
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
  @IsNumber()
  @Max(180)
  @Min(-180)
  lng: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Max(90)
  @Min(-90)
  lat: number;

  @Field(type => MarkerVisibility, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(MarkerVisibility))
  visibility: MarkerVisibility = MarkerVisibility.PRIVATE;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image1?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image2?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image3?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image4?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image5?: string;
}
