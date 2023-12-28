import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, {
    message: 'newPassword must be longer than 6 characters',
  })
  public newPassword: string;
}

export class SendMailResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

export class LoginDTO {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class GenerateAccessTokenDTO {
  @IsString()
  public refresh_token: string;
}
