import { Controller, Get, Post, Query } from '@nestjs/common';
import { WalkService } from './walk.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '../entites/User';
import { SearchWalkCalendarDto } from './dto/search-walk-calendar.dto';
import { SearchWalkDetailDto } from './dto/search-walk-detail.dto';

@ApiTags('walk')
@Controller('walk')
export class WalkController {
  constructor(private readonly walkService: WalkService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '산책 시작/종료' })
  @Post()
  async createWalkHistoryStartOrEnd(@UserDecorator() user: User) {
    const walkHistory = await this.walkService.getWalkHistoryLast(user);
    let savedSeq;
    if (!walkHistory || walkHistory.status == 'END') {
      savedSeq = await this.walkService.createWalkHistoryStart(user);
    } else {
      savedSeq = await this.walkService.updateWalkHistoryEnd(walkHistory.seq);
    }

    return { seq: savedSeq };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '산책 일시정지/일시정지 취소' })
  @Post('pause')
  async createWalkHistoryPauseStartOrEnd(@UserDecorator() user: User) {
    const walkHistory = await this.walkService.getWalkHistoryLast(user);
    let savedSeq;
    if (walkHistory.status == 'PAUSE') {
      savedSeq = await this.walkService.updateWalkHistoryPauseEnd(walkHistory.seq);
    } else {
      savedSeq = await this.walkService.createWalkHistoryPauseStart(walkHistory.seq, user);
    }

    return { seq: savedSeq };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '당일 산책 정보' })
  @Get('today')
  async getWalkHistoryToday(@UserDecorator() user: User) {
    return await this.walkService.getWalkHistoryToday(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '캘린더 정보 조회' })
  @Get('calendar')
  async getWalkHistoryCalendar(@Query() searchWalkCalendarDto: SearchWalkCalendarDto, @UserDecorator() user: User) {
    return await this.walkService.getWalkHistoryCalendar(searchWalkCalendarDto, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '특정 일자 산책 정보 조회' })
  @Get('detail')
  async getWalkHistoryDetail(@Query() searchWalkDetailDto: SearchWalkDetailDto, @UserDecorator() user: User) {
    return await this.walkService.getWalkHistoryDetail(searchWalkDetailDto, user);
  }
}
