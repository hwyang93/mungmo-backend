import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: '페이징 사용여부', required: false, default: true })
  noPaging: boolean;

  @ApiProperty({ description: '현재 페이지', required: false, default: 1 })
  curPage: number;

  @ApiProperty({ description: '페이지당 갯수', required: false, default: 15 })
  perPage: number;
}
