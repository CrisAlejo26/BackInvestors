import { Controller, Get, Post, Body, UseGuards, Param, Patch, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginUserDto, UpdateAuthDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders, RoleProtected, Auth,  } from './decorators';
import { InversorAuth } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    // @Req() request: Express.Request
    @GetUser() user: InversorAuth,
    @GetUser('email') userEmail: InversorAuth,
    @RawHeaders() rawHeaders: string[],
  ) {

    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
    }
  }

  // @SetMetadata('roles', ['admin', 'inversor'])

  @Get('private2')
  @RoleProtected( ValidRoles.Admin )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: InversorAuth,
  )
  {
      return {
        ok: true,
        user,
    }
  }

  @Get('private3')
  @Auth( ValidRoles.Inversor )
  privateRoute3(
    @GetUser() user: InversorAuth,
  )
  {
      return {
        ok: true,
        user,
    }
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  updateUserLogin(
    @Param('id', ParseUUIDPipe) id: string, @Body() createAuthDto: UpdateAuthDto
  ) {
    return this.authService.update(id, createAuthDto);
  }
}
