import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(username: string, pass: string) {
    const user = await this.usersService.retrieve(username);
    if (user.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...rest } = user;
    return rest;
  }
}
