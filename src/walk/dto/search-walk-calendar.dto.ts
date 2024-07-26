import { ApiProperty } from '@nestjs/swagger';

export class SearchWalkCalendarDto {
  @ApiProperty({ description: '년월', example: 'YYYY-MM', default: '2024-07' })
  yearAndMonth: string;
}
