import { Module } from '@nestjs/common';
import { WalkService } from './walk.service';
import { WalkController } from './walk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalkHistory } from '../entites/WalkHistory';
import { Pet } from '../entites/Pet';

@Module({
  imports: [TypeOrmModule.forFeature([WalkHistory, Pet])],
  controllers: [WalkController],
  providers: [WalkService]
})
export class WalkModule {}
