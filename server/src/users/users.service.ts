import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

type User = {
  login: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async retrieve(where: Prisma.UserWhereInput): Promise<User | undefined> {
    return this.prismaService.user.findFirst({ where });
  }

  async exists(where: Prisma.UserWhereInput) {
    return (await this.prismaService.user.count({ where })) > 0;
  }

  async create(data: Prisma.UserCreateInput) {
    const { login, password } = data;
    return this.prismaService.user.create({
      data: {
        login,
        password: await this.hash(password),
      },
    });
  }

  private hash(password: string) {
    return bcrypt.hash(
      password,
      Number(this.configService.get('BCRYPT_SALT_ROUNDS')),
    );
  }
}
