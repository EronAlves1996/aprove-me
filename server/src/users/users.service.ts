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

  async retrieve(username: string): Promise<User | undefined> {
    return this.users.find((u) => u.login === username);
  }
}
