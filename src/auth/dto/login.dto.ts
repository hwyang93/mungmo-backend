import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: '소셜 로그인 타입' })
  socialLoginType: number;

  @ApiProperty({ description: '토큰' })
  token: string;
}
