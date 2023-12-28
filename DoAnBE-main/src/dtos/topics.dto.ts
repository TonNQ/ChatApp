import { IsPathUrl } from '@/decorators/isPathUrl.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  public description: string;

  @IsNotEmpty()
  @IsPathUrl({
    message: 'Cover $value is not a path or not exits',
  })
  public cover: string;
}
