import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  @ApiOperation({ summary: 'Admin login' })
  async adminLogin(@Body() loginDto: any) {
    return this.authService.adminLogin(loginDto.email, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req: any) {
    return this.authService.getUserProfile(req.user.userId);
  }
}
