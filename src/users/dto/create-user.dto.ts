import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Provide an email.' })
  @IsEmail({}, { message: 'Provide a valid email.' })
  @MaxLength(200, {
    message: 'The email must be a maximum of 200 characters.',
  })
  email: string;

  @IsNotEmpty({ message: 'Provide the username.' })
  @MaxLength(200, {
    message: 'The name must have a maximum of 200 characters.',
  })
  name: string;

  @IsNotEmpty({ message: 'Provide a password.' })
  @MinLength(6, {
    message: 'The password must be a minimum of 6 characters.',
  })
  password: string;

  @IsNotEmpty({ message: 'Provide password confirmation.' })
  @MinLength(6, {
    message: 'Password confirmation must be a minimum of 6 characters.',
  })
  passwordConfirmation: string;
}
