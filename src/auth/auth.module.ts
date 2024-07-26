import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { User } from '../entites/User';
import { UserService } from '../user/user.service';
import { Pet } from '../entites/Pet';
// import { KakaoStrategy } from './kakao.strategy';

@Module({
  imports: [
    CacheModule.register(),
    PassportModule,
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_PRIVATE_KEY
      // signOptions: { expiresIn: '10m' }
    }),
    TypeOrmModule.forFeature([User, Pet]),
    UserModule
  ],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
