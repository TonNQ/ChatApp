import { IsObjectId } from '@/decorators/isObjectId.decorator';
import { IsPathUrl } from '@/decorators/isPathUrl.decorator';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsString()
  @IsNotEmpty()
  public title: string;

  @IsNotEmpty()
  @IsPathUrl({
    message: 'Cover $value is not a path or not exits',
  })
  public cover: string;

  @IsString()
  @IsNotEmpty()
  public metaTitle: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsString()
  @IsNotEmpty()
  public metaDescription: string;

  @IsBoolean()
  @IsNotEmpty()
  public canComment: boolean;

  @IsOptional()
  public tags?: string[];

  @IsOptional()
  public metaKeywords?: string[];

  @IsObjectId()
  @IsOptional()
  public user?: string;
}
