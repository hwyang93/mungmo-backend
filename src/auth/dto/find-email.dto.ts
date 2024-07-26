import { ApiProperty } from '@nestjs/swagger';

export class FindEmailDto {
  @ApiProperty({ description: '회원이름' })
  name: string;

  @ApiProperty({ description: '회원 핸드폰 번호' })
  phone: string;
}
