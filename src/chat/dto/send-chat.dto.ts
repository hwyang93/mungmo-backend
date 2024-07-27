import { ApiProperty } from '@nestjs/swagger';

export class SendChatDto {
  @ApiProperty({ description: '채팅방 번호', nullable: true })
  chatRoomSeq: number;

  @ApiProperty({ description: '메세지' })
  message: string;
}
