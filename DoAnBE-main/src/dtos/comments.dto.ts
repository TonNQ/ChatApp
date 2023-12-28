import { IsObjectId } from '@/decorators/isObjectId.decorator';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsObjectId()
  @IsOptional()
  public user?: string;

  @IsOptional()
  @IsObjectId()
  public parentComment?: string;

  @IsOptional()
  @IsObjectId()
  public postId?: string;
}
