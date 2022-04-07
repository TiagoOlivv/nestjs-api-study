import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.signUp(createUserDto);
    return { message: 'Successfully registered.' };
  }

  @Post('/signin')
  async signIn(
    @Body(ValidationPipe) credentiaslsDto: CredentialsDto,
  ): Promise<{ token: string }> {
    return await this.authService.signIn(credentiaslsDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
