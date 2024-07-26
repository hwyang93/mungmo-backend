import { CACHE_MANAGER, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

import dayjs from 'dayjs';

import { CheckAuthNumberDto } from './dto/check-auth-number.dto';
import { FindEmailDto } from './dto/find-email.dto';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    private jwtService: JwtService
  ) {}

  // async validateUser(email: string, password: string) {
  //   const member = await this.memberRepository.createQueryBuilder('member').select().addSelect('member.password').where({ email }).getOne();
  //
  //   if (!member) {
  //     return null;
  //   }
  //   const result = await bcrypt.compare(password, member.password);
  //
  //   if (result) {
  //     const { ...userWithoutPassword } = member;
  //     await this.memberRepository.createQueryBuilder('member').update().set({ lastLogin: new Date() }).where({ seq: member.seq }).execute();
  //
  //     return userWithoutPassword;
  //   }
  //   return null;
  // }
  //
  async login(user: any) {
    const payload = { email: user.email, seq: user.seq };

    const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_PRIVATE_KEY });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d', secret: process.env.JWT_PUBLIC_KEY });
    await this.cacheManager.set(user.email, refreshToken, 0);

    return { accessToken, refreshToken };
  }
  //
  // async refresh(token: string, member: Member) {
  //   const cachedRefreshToken = (await this.cacheManager.get(member.email))?.toString();
  //
  //   let decodedToken;
  //   try {
  //     decodedToken = this.jwtService.verify(cachedRefreshToken, { secret: process.env.JWT_PUBLIC_KEY });
  //   } catch (e) {
  //     throw new UnauthorizedException('만료된 리프레시 토큰입니다.');
  //   }
  //   const memberInfo = await this.memberRepository.findOne({
  //     where: { seq: decodedToken.seq },
  //     select: ['seq', 'email']
  //   });
  //   const payload = { seq: memberInfo.seq, email: member.email };
  //   return {
  //     accessToken: this.jwtService.sign(payload, { expiresIn: '1m', secret: process.env.JWT_PRIVATE_KEY })
  //   };
  // }
  //
  // async OAuthLogin({ req, res }) {
  //   console.log('req::::::');
  //   console.log(req);
  //   console.log('res::::::');
  //   console.log(res);
  // }
  //
  // async getFindEmail(findEmailDto: FindEmailDto) {
  //   return await this.memberRepository
  //     .createQueryBuilder('member')
  //     .select('member.email')
  //     .addSelect('member.createdAt')
  //     .addSelect("DATE_FORMAT(member.createdAt, '%Y.%m.%d') ", 'member_CREATED_AT')
  //     .where('member.name = :name', { name: findEmailDto.name })
  //     .andWhere('member.phone = :phone', { phone: findEmailDto.phone })
  //     .getMany();
  // }
  //
  // async createSendEmailAuth(createSendEmailDto: CreateSendEmailDto) {
  //   await this.sendMail(createSendEmailDto.email);
  // }
  //
  // async checkAuthNumberByEmail(checkAuthNumberDto: CheckAuthNumberDto) {
  //   const authInfo = await this.emailAuthRepository
  //     .createQueryBuilder('emailAuth')
  //     .where('emailAuth.sendToEmail = :email', { email: checkAuthNumberDto.email })
  //     .orderBy('emailAuth.issueDate', 'DESC')
  //     .limit(1)
  //     .getOne();
  //
  //   const diffDate = dayjs(new Date()).diff(authInfo.issueDate, 'minute', true);
  //
  //   if (diffDate > 10) {
  //     throw new UnauthorizedException('유효시간이 만료된 인증번호 입니다.');
  //   }
  //
  //   if (checkAuthNumberDto.authNumber !== authInfo.authNumber) {
  //     throw new UnauthorizedException('일치하지 않은 인증번호 입니다.');
  //   }
  // }
  //
  // async sendMail(email: string) {
  //   const authNumber = this.makeAuthNumber();
  //   const issueDate = dayjs(new Date()).format('YYYY.MM.DD HH:mm:ss');
  //   await this.mailerService
  //     .sendMail({
  //       to: email,
  //       subject: '[링크핏] 비밀번호 찾기 인증번호',
  //       template: './sendEmailAuth.ejs',
  //       context: {
  //         authNumber: authNumber,
  //         issueDate: issueDate
  //       }
  //     })
  //     .then(result => {
  //       const emailAuth = new EmailAuth();
  //       emailAuth.authNumber = authNumber;
  //       emailAuth.sendToEmail = email;
  //       emailAuth.issueDate = issueDate;
  //       this.emailAuthRepository.save(emailAuth);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
  //     });
  // }
  //
  // makeAuthNumber() {
  //   let authNumber = '';
  //   for (let i = 0; i < 6; i++) {
  //     const num = Math.floor(Math.random() * 10);
  //     authNumber += num;
  //   }
  //   return authNumber;
  // }
}
