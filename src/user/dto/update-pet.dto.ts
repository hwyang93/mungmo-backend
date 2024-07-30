import { ApiProperty } from '@nestjs/swagger';
import { Pet } from '../../entites/Pet';

export class UpdatePetDto {
  @ApiProperty({ description: '애완견 고유번호' })
  petSeq: number;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '견종' })
  breed: string;

  @ApiProperty({ description: '무게' })
  weight: number;

  @ApiProperty({ description: '출생연도' })
  birth: string;

  @ApiProperty({ description: '기타 특이사항' })
  etc: string;

  @ApiProperty({ description: '산책목표' })
  walkingGoal: number;

  toEntity() {
    const entity = new Pet();
    entity.seq = this?.petSeq;
    entity.name = this?.name;
    entity.breed = this?.breed;
    entity.weight = this?.weight;
    entity.birth = this?.birth;
    entity.etc = this?.etc;
    entity.walkingGoal = this?.walkingGoal;

    return entity;
  }
}
