import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user-roles.enum';
import { User } from './user.entity';

import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password !== createUserDto.passwordConfirmation)
      throw new UnprocessableEntityException('Passwords do not match.');
    else return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
  }
}
