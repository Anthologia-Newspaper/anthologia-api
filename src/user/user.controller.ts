import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { JwtPayload } from 'src/authentication/contracts/JwtPayload.interface';
import { User } from 'src/decorators/user.decorator';
import { handleErrors } from 'src/utils/handle-errors';

import { UpdateUsernameDto } from './dto/update-username.dto';
import { UploadProfilePicDto } from './dto/upload-profile-pic.dto';
import { UserService } from './user.service';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@User() user: JwtPayload) {
    try {
      return await this.userService.me(user.sub);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Patch('profile-pic')
  async uploadProfilePic(
    @User() user: JwtPayload,
    uploadProfilePicDto: UploadProfilePicDto,
  ) {
    try {
      return await this.userService.uploadProfilePic(
        user.sub,
        uploadProfilePicDto.profilePic,
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @Patch('username')
  async updateUsername(
    @User() user: JwtPayload,
    @Body() body: UpdateUsernameDto,
  ) {
    try {
      return await this.userService.updateUsername(user.sub, body.newUsername);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
