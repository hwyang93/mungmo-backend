import { ApiProperty } from '@nestjs/swagger';
import { Pet } from '../../entites/Pet';

export class CreatePetDto {
  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '견종' })
  breed: string;

  @ApiProperty({ description: '무게' })
  weight: number;

  @ApiProperty({ description: '출생연도' })
  birth: number;

  @ApiProperty({ description: '기타 특이사항' })
  etc: string;

  toEntity() {
    const entity = new Pet();
    entity.name = this?.name;
    entity.breed = this?.breed;
    entity.weight = this?.weight;
    entity.birth = this?.birth;
    entity.etc = this?.etc;

    return entity;
  }
}
