import { IsContainAnswer } from '@/decorators/isContainAnswer.decorator';
import { IsObjectId } from '@/decorators/isObjectId.decorator';
import { IsPathUrl } from '@/decorators/isPathUrl.decorator';
import { ArrayMinSize, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsOptional()
  @IsPathUrl({
    message: 'Audio $value is not a path or not exits',
  })
  public audio?: string;

  @IsString()
  @IsNotEmpty()
  public answer: string;

  @IsObjectId({
    message: 'LessonId $value is not ObjectId.',
  })
  @IsNotEmpty()
  public lessonId: string;

  @IsNumber()
  @IsOptional()
  public audioCutFrom?: number;

  @IsNumber()
  @IsOptional()
  public audioCutTo?: number;

  @IsObjectId({
    message: 'ParentQuestion $value is not ObjectId.',
  })
  @IsOptional()
  public parentQuestion?: string;

  @IsString()
  @IsOptional()
  public text?: string;

  @IsString()
  @IsOptional()
  @IsPathUrl({
    message: 'Image $value is not a path or not exits',
  })
  public image?: string;

  @IsOptional()
  @IsContainAnswer({
    message: 'Choices must contain answer',
  })
  public choices?: string[];
}

export class AnswerQuestionDto {
  @IsString()
  @IsNotEmpty()
  public answer: string;
}

export class AloneQuestionDTO {
  @IsOptional()
  filter?: string[] | object;
}
