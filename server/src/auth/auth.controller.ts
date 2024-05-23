import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('integrations/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
}
