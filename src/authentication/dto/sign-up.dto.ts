import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  username: string;
}
