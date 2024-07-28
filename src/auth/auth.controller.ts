import { Body, CACHE_MANAGER, Controller, Get, Inject, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { getKakaoUserInfo } from '../common/api/kakao';
import { UserService } from '../user/user.service';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '../entites/User';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly userService: UserService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    schema: {
      properties: {
        socialLoginType: { type: 'int', default: 1 },
        token: { type: 'string' }
      }
    }
  })
  @Post('login')
  async login(@Req() req, @Body() loginDto: LoginDto) {
    let socialInfo;
    if (loginDto.socialLoginType == 1) {
      socialInfo = await getKakaoUserInfo(loginDto.token);
      console.log(socialInfo);
      if (!socialInfo) {
        throw new UnauthorizedException('유효하지 않는 토큰 입니다.');
      }
    }
    const userInfo = await this.userService.getMemberInfoByEmail(socialInfo.email);
    if (!userInfo) {
      throw new UnauthorizedException('일치하는 정보가 없습니다.');
    }

    return this.authService.login(userInfo);
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(@Req() req, @UserDecorator() user: User) {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    } else {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    return this.authService.refresh(token, user);
  }

  // @Get('login/kakao')
  // @UseGuards(AuthGuard('kakao'))
  // async loginKakao(@Req() req, @Res() res) {
  //   console.log('kakao');
  //   await this.authService.login({ req, res });
  // }

  // @ApiOperation({
  //   summary: '카카오 로그인 콜백',
  //   description: '카카오 로그인시 콜백 라우터입니다.'
  // })
  // @UseGuards(KakaoAuthGuard)
  // @Get('auth/kakao/callback')
  // async kakaocallback(@Req() req, @Res() res, @MemberDecorator() member: Member) {
  //   console.log('callback');
  //   console.log(member);
  //   // if (req.user.type === 'login') {
  //   //   res.cookie('access_token', req.user.access_token);
  //   //   res.cookie('refresh_token', req.user.refresh_token);
  //   // } else {
  //   //   res.cookie('once_token', req.user.once_token);
  //   // }
  //   res.redirect('http://localhost:3000/user/profile');
  //   // res.end();
  //   // return member.email;
  //   return res.end();
  // }

  // @ApiOperation({ summary: '이메일 찾기' })
  // @Get('email')
  // async getFindEmail(@Query() findEmailDto: FindEmailDto) {
  //   return this.authService.getFindEmail(findEmailDto);
  // }
  //
  // @ApiOperation({ summary: '이메일 인증번호 발송' })
  // @Post('email')
  // async createSendEmailAuth(@Body() createSendEmailDto: CreateSendEmailDto) {
  //   return this.authService.createSendEmailAuth(createSendEmailDto);
  // }
  //
  // @ApiOperation({ summary: '이메일 인증번호 확인' })
  // @Post('check/email')
  // async checkAuthNumberByEmail(@Body() checkAuthNumberDto: CheckAuthNumberDto) {
  //   return this.authService.checkAuthNumberByEmail(checkAuthNumberDto);
  // }
}
