import {
  Body,
  ClassSerializerInterceptor,
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
import { UserEntity } from './entities/User.entity';

@ApiCookieAuth()
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly ipfsService: IPFSService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  async me(@User() user: JwtPayload) {
    try {
      return new UserEntity(await this.userService.me(user.sub));
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('profilePic'))
  @Post('profile-pic')
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

      return new UserEntity(
        await this.userService.updateProfilePic(user.sub, cid),
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('username')
  async updateUsername(
    @User() user: JwtPayload,
    @Body() body: UpdateUsernameDto,
  ) {
    try {
      return new UserEntity(
        await this.userService.updateUsername(user.sub, body.newUsername),
      );
    } catch (err: unknown) {
      handleErrors(err);
    }
  }
}
