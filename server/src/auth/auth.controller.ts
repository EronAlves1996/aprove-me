import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { UserDto } from './UserDto';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { USER_ALREADY_EXISTS } from 'src/messages';

@Controller('integrations/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post()
  @Public()
  signIn(@Body() userDto: UserDto) {
    return this.authService.signIn(userDto.login, userDto.password);
  }

  @Post('/register')
  @Public()
  async register(@Body() userDto: UserDto, @Res() response: Response) {
    if (await this.usersService.exists({ login: userDto.login })) {
      response.statusCode = 400;
      response.json(USER_ALREADY_EXISTS);
      return;
    }
    await this.usersService.create(userDto);
    response.statusCode = HttpStatus.CREATED;
    response.send();
  }
}
