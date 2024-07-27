import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entites/User';
import { Pet } from '../entites/Pet';

@Module({
  imports: [TypeOrmModule.forFeature([User, Pet])],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService]
})
export class UserModule {}
