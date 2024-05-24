import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [ConfigModule],
})
export class UsersModule { }
