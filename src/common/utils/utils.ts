import { Pet } from '../../entites/Pet';

export function messageCombinePetInfo(message: string, petInfo: Pet) {
  let result = '강아지 이름은 ' + petInfo.name + '이고';
  result += '견종은 ' + petInfo.breed + '이고';
  result += '나이는 ' + petInfo.birth + '년도에 태어났고';
  result += '몸무게는 ' + petInfo.weight + 'KG 이고';
  result += '기타 특이사항은 ' + petInfo.etc + '야 \n';
  result += message;
  return result;
}
