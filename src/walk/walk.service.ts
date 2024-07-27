import { Injectable } from '@nestjs/common';
import { User } from '../entites/User';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WalkHistory } from '../entites/WalkHistory';
import dayjs from 'dayjs';
import { SearchWalkCalendarDto } from './dto/search-walk-calendar.dto';
import { SearchWalkDetailDto } from './dto/search-walk-detail.dto';
import 'dayjs/locale/ko';
import { Pet } from '../entites/Pet';

dayjs.locale('ko');

interface IdayWalkInfo {
  startTime: string;
  endTime: string;
  totalTime: string;
}
@Injectable()
export class WalkService {
  constructor(
    @InjectRepository(WalkHistory) private walkHistoryRepository: Repository<WalkHistory>,
    @InjectRepository(Pet) private petRepository: Repository<Pet>
  ) {}

  async createWalkHistoryStart(user: User) {
    const workHistory = new WalkHistory();
    workHistory.startedAt = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    workHistory.status = 'ING';
    workHistory.userSeq = user.seq;

    const savedWalkHistory = await this.walkHistoryRepository.save(workHistory);
    return savedWalkHistory.seq;
  }

  async updateWalkHistoryEnd(seq: number) {
    await this.walkHistoryRepository
      .createQueryBuilder('walkHistory')
      .update()
      .set({ endedAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), status: 'PAUSE_END' })
      .where('walkHistory.parentSeq = :seq', { seq })
      .andWhere('walkHistory.status = "PAUSE"')
      .execute();
    await this.walkHistoryRepository
      .createQueryBuilder('walkHistory')
      .update()
      .set({ endedAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), status: 'END' })
      .where({ seq })
      .execute();
    return seq;
  }

  async getWalkHistoryLast(user: User) {
    return await this.walkHistoryRepository
      .createQueryBuilder('workHistory')
      .where('workHistory.userSeq = :userSeq', { userSeq: user.seq })
      .andWhere('workHistory.parentSeq is null')
      .orderBy('workHistory.createdAt', 'DESC')
      .getOne();
  }

  async createWalkHistoryPauseStart(seq: number, user: User) {
    const walkHistory = new WalkHistory();
    walkHistory.startedAt = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    walkHistory.status = 'PAUSE';
    walkHistory.userSeq = user.seq;
    walkHistory.parentSeq = seq;

    const savedWalkHistory = await this.walkHistoryRepository.save(walkHistory);

    await this.walkHistoryRepository.createQueryBuilder('walkHistory').update().set({ status: 'PAUSE' }).where({ seq }).execute();
    return savedWalkHistory.seq;
  }

  async updateWalkHistoryPauseEnd(parentSeq: number) {
    const pauseWalkHistory = await this.walkHistoryRepository
      .createQueryBuilder('walkHistory')
      .where('walkHistory.parentSeq = :parentSeq', { parentSeq })
      .orderBy('walkHistory.createdAt', 'DESC')
      .getOne();
    await this.walkHistoryRepository
      .createQueryBuilder('walkHistory')
      .update()
      .set({ endedAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), status: 'PAUSE_END' })
      .where({ seq: pauseWalkHistory.seq })
      .execute();
    await this.walkHistoryRepository.createQueryBuilder('walkHistory').update().set({ status: 'ING' }).where({ seq: parentSeq }).execute();
    return parentSeq;
  }

  async getWalkHistoryToday(user: User) {
    const todayWalkHistory = await this.walkHistoryRepository
      .createQueryBuilder('walkHistory')
      .where('walkHistory.userSeq = :userSeq', { userSeq: user.seq })
      .andWhere('walkHistory.parentSeq is null')
      .andWhere('walkHistory.createdAt >= :today', { today: dayjs(new Date()).startOf('day').format('YYYY-MM-DD HH:mm:ss') })
      .orderBy('walkHistory.createdAt', 'DESC')
      .getMany();

    let walkTime = 0;
    for (const walkInfo of todayWalkHistory) {
      let standDate;

      const pauseWalkList = await this.walkHistoryRepository
        .createQueryBuilder('walkHistory')
        .where('walkHistory.parentSeq = :parentSeq', { parentSeq: walkInfo.seq })
        .orderBy('walkHistory.createdAt', 'ASC')
        .getMany();
      for (const pauseWalkHistory of pauseWalkList) {
        if (!standDate) standDate = walkInfo.startedAt;
        const pauseStartTime = dayjs(pauseWalkHistory.startedAt);

        console.log('standDate:::', dayjs(standDate).format('YYYY-MM-DD HH:mm:ss'));
        console.log('pauseStartTime:::', pauseStartTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log(pauseStartTime.diff(dayjs(standDate), 'seconds'));
        walkTime += pauseStartTime.diff(dayjs(standDate), 'seconds');
        standDate = pauseWalkHistory.endedAt;
      }
      if (!standDate) standDate = walkInfo.startedAt;
      const walkEndTime = !walkInfo.endedAt ? dayjs(new Date()) : dayjs(walkInfo.endedAt);
      console.log('standDate:::', dayjs(standDate).format('YYYY-MM-DD A HH:mm:ss'));
      console.log('walkEndTime:::', walkEndTime.format('YYYY-MM-DD A HH:mm:ss'));
      console.log(walkEndTime.diff(dayjs(standDate), 'seconds'));
      walkTime += walkEndTime.diff(dayjs(standDate), 'seconds');
    }
    const petInfo = await this.petRepository.createQueryBuilder('pet').where('pet.userSeq = :userSeq', { userSeq: user.seq }).getOne();
    return {
      petInfo: {
        name: petInfo.name,
        walkingGoal: petInfo.walkingGoal
      },
      todayWalkTime: walkTime > 0 ? parseInt(String(walkTime / 60)) + ':' + (walkTime % 60) : '00:00',
      round: todayWalkHistory.length == 0 ? '1회차' : todayWalkHistory[0].status != 'END' ? todayWalkHistory.length : todayWalkHistory.length + 1
    };
  }

  async getPauseWalkHistoryByParentSeq(parentSeq: number) {
    return await this.walkHistoryRepository
      .createQueryBuilder('walkHistory')
      .where('walkHistory.parentSeq = :parentSeq', { parentSeq })
      .orderBy('walkHistory.createdAt', 'DESC')
      .getMany();
  }

  async getWalkHistoryCalendar(searchWalkCalendarDto: SearchWalkCalendarDto, user: User) {
    const walkHistoryDayList = await this.walkHistoryRepository
      .createQueryBuilder('walkHistory')
      .select(`DISTINCT date_format(walkHistory.createdAt, "%Y-%m-%d") AS walkDate`)
      .where('walkHistory.userSeq = :userSeq', { userSeq: user.seq })
      .andWhere('walkHistory.parentSeq is null')
      .andWhere('walkHistory.status = "END"')
      .andWhere('walkHistory.createdAt >= :startDate', {
        startDate: dayjs(new Date(searchWalkCalendarDto.yearAndMonth)).startOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss')
      })
      .andWhere('walkHistory.createdAt <= :endDate', {
        endDate: dayjs(new Date(searchWalkCalendarDto.yearAndMonth)).endOf('month').endOf('day').format('YYYY-MM-DD HH:mm:ss')
      })
      .orderBy('walkHistory.createdAt', 'ASC')
      .getRawMany();

    const walkInfoList = await this.walkHistoryRepository
      .createQueryBuilder('walkHistory')
      .where('walkHistory.userSeq = :userSeq', { userSeq: user.seq })
      .andWhere('walkHistory.parentSeq is null')
      .andWhere('walkHistory.status = "END"')
      .andWhere('walkHistory.createdAt >= :startDate', {
        startDate: dayjs(new Date(searchWalkCalendarDto.yearAndMonth)).startOf('month').startOf('day').format('YYYY-MM-DD HH:mm:ss')
      })
      .andWhere('walkHistory.createdAt <= :endDate', {
        endDate: dayjs(new Date(searchWalkCalendarDto.yearAndMonth)).endOf('month').endOf('day').format('YYYY-MM-DD HH:mm:ss')
      })
      .getMany();

    let walkTime = 0;
    for (const walkInfo of walkInfoList) {
      let standDate;

      const pauseWalkList = await this.walkHistoryRepository
        .createQueryBuilder('walkHistory')
        .where('walkHistory.parentSeq = :parentSeq', { parentSeq: walkInfo.seq })
        .orderBy('walkHistory.createdAt', 'ASC')
        .getMany();
      for (const pauseWalkHistory of pauseWalkList) {
        if (!standDate) standDate = walkInfo.startedAt;
        const pauseStartTime = dayjs(pauseWalkHistory.startedAt);

        console.log('standDate:::', dayjs(standDate).format('YYYY-MM-DD HH:mm:ss'));
        console.log('pauseStartTime:::', pauseStartTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log(pauseStartTime.diff(dayjs(standDate), 'seconds'));
        walkTime += pauseStartTime.diff(dayjs(standDate), 'seconds');
        standDate = pauseWalkHistory.endedAt;
      }
      if (!standDate) standDate = walkInfo.startedAt;
      const walkEndTime = dayjs(walkInfo.endedAt);
      console.log('standDate:::', dayjs(standDate).format('YYYY-MM-DD A HH:mm:ss'));
      console.log('walkEndTime:::', walkEndTime.format('YYYY-MM-DD A HH:mm:ss'));
      console.log(walkEndTime.diff(dayjs(standDate), 'seconds'));
      walkTime += walkEndTime.diff(dayjs(standDate), 'seconds');
    }

    const averageWalkTime = walkHistoryDayList.length == 0 ? 0 : Math.round(walkTime / walkHistoryDayList.length);
    console.log('walkTime:::', walkTime);
    console.log('walkHistoryDayList.length:::', walkHistoryDayList.length);
    console.log('averageWalkTime:::', averageWalkTime);
    const dayList = [];
    for (const day of walkHistoryDayList) {
      dayList.push(day.walkDate);
    }
    return { dayList: dayList, averageWalkTime: parseInt(String(averageWalkTime / 60)) + '분 ' + (averageWalkTime % 60) + '초' };
  }

  async getWalkHistoryDetail(searchWalkDetailDto: SearchWalkDetailDto, user: User) {
    const dayWalkInfoList = [];
    const walkInfoList = await this.walkHistoryRepository
      .createQueryBuilder('walkHistory')
      .where('walkHistory.userSeq = :userSeq', { userSeq: user.seq })
      .andWhere('walkHistory.parentSeq is null')
      .andWhere('walkHistory.status = "END"')
      .andWhere('walkHistory.createdAt >= :startDate', {
        startDate: dayjs(new Date(searchWalkDetailDto.date)).startOf('day').format('YYYY-MM-DD HH:mm:ss')
      })
      .andWhere('walkHistory.createdAt <= :endDate', {
        endDate: dayjs(new Date(searchWalkDetailDto.date)).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      })
      .getMany();

    for (const walkInfo of walkInfoList) {
      let walkTime = 0;
      let standDate;

      const pauseWalkList = await this.walkHistoryRepository
        .createQueryBuilder('walkHistory')
        .where('walkHistory.parentSeq = :parentSeq', { parentSeq: walkInfo.seq })
        .orderBy('walkHistory.createdAt', 'ASC')
        .getMany();
      for (const pauseWalkHistory of pauseWalkList) {
        if (!standDate) standDate = walkInfo.startedAt;
        const pauseStartTime = dayjs(pauseWalkHistory.startedAt);

        console.log('standDate:::', dayjs(standDate).format('YYYY-MM-DD HH:mm:ss'));
        console.log('pauseStartTime:::', pauseStartTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log(pauseStartTime.diff(dayjs(standDate), 'seconds'));
        walkTime += pauseStartTime.diff(dayjs(standDate), 'seconds');
        standDate = pauseWalkHistory.endedAt;
      }
      if (!standDate) standDate = walkInfo.startedAt;
      const walkEndTime = dayjs(walkInfo.endedAt);
      console.log('standDate:::', dayjs(standDate).format('YYYY-MM-DD A HH:mm:ss'));
      console.log('walkEndTime:::', walkEndTime.format('YYYY-MM-DD A HH:mm:ss'));
      console.log(walkEndTime.diff(dayjs(standDate), 'seconds'));
      walkTime += walkEndTime.diff(dayjs(standDate), 'seconds');
      console.log(parseInt(String(walkTime / 60)) + '분 ' + (walkTime % 60) + '초');
      dayWalkInfoList.push({
        startTime: dayjs(walkInfo.startedAt).format('A HH:mm'),
        endTime: dayjs(walkInfo.endedAt).format('A HH:mm'),
        totalTime: parseInt(String(walkTime / 60)) + '분 ' + (walkTime % 60) + '초'
      });
    }
    return dayWalkInfoList;
  }
}
