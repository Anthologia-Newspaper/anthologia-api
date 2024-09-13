import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Express } from 'express';
import { AuthGuard } from 'src/authentication/authentication.guard';
import { JwtPayload } from 'src/authentication/contracts/JwtPayload.interface';
import { User } from 'src/decorators/user.decorator';
import { IPFSService } from 'src/ipfs/ipfs.service';
import { handleErrors } from 'src/utils/handle-errors';

import { UpdateUsernameDto } from './dto/update-username.dto';
import { UserService } from './user.service';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly ipfsService: IPFSService,
  ) {}

  @Get('me')
  async me(@User() user: JwtPayload) {
    try {
      return await this.userService.me(user.sub);
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  // TODO: Add gateway prefix in interceptor
  @Post('profile-pic')
  @UseInterceptors(FileInterceptor('profilePic'))
  async uploadProfilePic(
    @User() user: JwtPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: '[image/png,image.jpeg,image.jpg]',
          }),
        ],
      }),
    )
    profilePic: Express.Multer.File,
  ) {
    try {
      const cid = await this.ipfsService.uploadImage(profilePic);

      return await this.userService.updateProfilePic(user.sub, cid);
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
