import { IsPathUrl } from '@/decorators/isPathUrl.decorator';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class EditUserDTO {
  @IsString()
  @IsOptional()
  public firstName?: string;

  @IsString()
  @IsOptional()
  public lastName?: string;

  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public password?: string;

  @IsOptional()
  @IsPathUrl({
    message: 'AvatarUrl $value is not a path or not exits',
  })
  public avatarUrl?: string;

  @IsString()
  @IsOptional()
  public province?: string;

  @IsString()
  @IsOptional()
  public phoneNumber?: string;

  @IsString()
  @IsOptional()
  public district?: string;

  @IsString()
  @IsOptional()
  public commune?: string;

  @IsString()
  @IsOptional()
  public address?: string;
}
