import { Body, Controller, Delete, Get, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '../entites/User';
import { CreateUserDto } from './dto/create-user.dto';
import { getKakaoUserInfo } from '../common/api/kakao';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async join(@Body() createUserDto: CreateUserDto) {
    let socialInfo;
    if (createUserDto.socialLoginType == 1) {
      socialInfo = await getKakaoUserInfo(createUserDto.token);
      console.log(socialInfo);
      if (!socialInfo) {
        throw new UnauthorizedException('유효하지 않는 토큰 입니다.');
      }
    }

    const userInfo = await this.userService.getMemberInfoByEmail(socialInfo.email);

    if (!!userInfo) {
      throw new UnauthorizedException('이미 가입한 이메일 입니다.');
    }

    return await this.userService.join(socialInfo, createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 조회' })
  @Get()
  getUserInfo(@UserDecorator() user: User) {
    return this.userService.getMemberInfoByEmail(user.email);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '회원 탈퇴' })
  @Delete()
  deleteUserInfo(@UserDecorator() user: User) {
    return this.userService.deleteUserInfo(user.seq);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '프로필 수정' })
  @Patch('pet')
  updatePetInfo(@Body() updatePetDto: UpdatePetDto) {
    return this.userService.updatePetInfo(updatePetDto);
  }
}
