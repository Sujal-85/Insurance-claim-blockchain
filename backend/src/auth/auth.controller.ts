import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Signup' })
  signup(@Body() body: any) {
    return this.authService.signup(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Post('admin-login')
  @ApiOperation({ summary: 'Admin Login' })
  adminLogin(@Body() body: any) {
    return this.authService.adminLogin(body);
  }
}
