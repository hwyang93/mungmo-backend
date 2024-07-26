import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entites/User';
import { CreatePetDto } from './create-pet.dto';

export class CreateUserDto {
  @ApiProperty({ description: '소셜 로그인 타입' })
  socialLoginType: number;

  @ApiProperty({ description: '토큰' })
  token: string;

  @ApiProperty({ description: '애완견 정보' })
  pet: CreatePetDto;
}
