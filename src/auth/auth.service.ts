import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';
import { UserRole } from 'src/users/user-roles.enum';
import { User } from 'src/users/user.entity';
import { UserRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation)
      throw new UnprocessableEntityException('Passwords do not match');
    else
      return await this.userRepository.createUser(createUserDto, UserRole.USER);
  }

  async signIn(credentiaslsDto: CredentialsDto) {
    const user = await this.userRepository.checkCredentials(credentiaslsDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }
}
