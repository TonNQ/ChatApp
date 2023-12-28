import { IsObjectId } from '@/decorators/isObjectId.decorator';
import { IsPathUrl } from '@/decorators/isPathUrl.decorator';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsObjectId({
    message: 'Topic $value is not ObjectId.',
  })
  @IsNotEmpty()
  public topicId: string;

  @IsString()
  @IsOptional()
  @IsPathUrl({
    message: 'Audio $value is not a path or not exits',
  })
  public audio?: string;

  @IsBoolean()
  @IsOptional()
  public isToeic?: boolean;
}
