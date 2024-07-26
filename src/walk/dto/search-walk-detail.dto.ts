import { ApiProperty } from '@nestjs/swagger';

export class SearchWalkDetailDto {
  @ApiProperty({ description: '일자', example: 'YYYY-MM-DD', default: '2024-07-25' })
  date: string;
}
