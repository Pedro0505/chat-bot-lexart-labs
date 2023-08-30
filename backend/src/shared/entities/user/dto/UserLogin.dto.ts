import { IsNotEmpty, Length, IsString, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @Length(1, 50, {
    message: 'Username must be between 1 and 50 characters',
  })
  public username: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(8, 50, {
    message: 'Password must be between 8 and 50 characters',
  })
  @Matches(/^[^\s]+$/, {
    message: 'Password cannot contain white spaces',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/[a-zA-Z]/, {
    message: 'Password must contain at least one letter',
  })
  public password: string;
}
