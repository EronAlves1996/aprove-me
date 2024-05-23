import { Injectable } from '@nestjs/common';

type User = {
  login: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      login: 'aprovame',
      password: 'aprovame',
    },
  ];

  async retrieve(_: string): Promise<User | undefined> {
    return this.users[0];
  }
}
