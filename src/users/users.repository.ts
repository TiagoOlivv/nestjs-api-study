import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user-roles.enum';
import { CredentialsDto } from 'src/auth/dto/credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    createUserDto: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const { email, name, password } = createUserDto;

    const user = this.create();
    user.email = email;
    user.name = name;
    user.role = role;
    user.password = password;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code.toString() === '23505')
        throw new ConflictException('Email is already in use.');
      else throw new InternalServerErrorException('Error saving data.');
    }
  }

  async checkCredentials(credentiaslsDto: CredentialsDto): Promise<User> {
    const { email, password } = credentiaslsDto;
    const user = await this.findOne({ email, status: true });

    if (user && (await user.checkPassword(password))) return user;
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
