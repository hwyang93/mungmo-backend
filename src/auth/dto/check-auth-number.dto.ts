import { ApiProperty } from '@nestjs/swagger';

export class CheckAuthNumberDto {
  @ApiProperty({ description: '인증번호 확인 이메일 주소' })
  email: string;

  @ApiProperty({ description: '인증번호' })
  authNumber: string;
}
