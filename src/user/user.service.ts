import { Injectable } from '@nestjs/common';
import { User } from '../entites/User';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Pet } from '../entites/Pet';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
    private datasource: DataSource
  ) {}

  async join(socialInfo: any, createUserDto: CreateUserDto) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const user = new User();
    user.email = socialInfo.email;
    user.name = socialInfo.name;
    user.socialLoginType = createUserDto.socialLoginType;
    let savedUser;
    try {
      savedUser = await this.userRepository.save(user);

      const pet = new Pet();
      pet.name = createUserDto.pet.name;
      pet.breed = createUserDto.pet.breed;
      pet.weight = createUserDto.pet.weight;
      pet.birth = createUserDto.pet.birth;
      pet.etc = createUserDto.pet.etc;
      pet.userSeq = savedUser.seq;
      await this.petRepository.save(pet);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return { seq: savedUser.seq };
  }

  async getMemberInfoByEmail(email: string) {
    return await this.userRepository.createQueryBuilder('user').leftJoinAndSelect('user.pet', 'pet').where('user.email = :email', { email }).getOne();
  }

  async deleteUserInfo(seq: number) {
    return await this.userRepository.createQueryBuilder('user').softDelete().where({ seq }).execute();
  }

  async updatePetInfo(updatePetDto: UpdatePetDto) {
    const pet = updatePetDto.toEntity();
    await this.petRepository.save(pet);
    return { seq: pet.seq };
  }

  async getPetInfo(userSeq: number) {
    return await this.petRepository.createQueryBuilder('pet').where('pet.userSeq = :userSeq', { userSeq }).getOne();
  }
}
