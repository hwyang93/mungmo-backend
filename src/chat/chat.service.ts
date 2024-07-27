import { Injectable } from '@nestjs/common';
import { User } from '../entites/User';
import { ChatRoom } from '../entites/ChatRoom';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Chat } from '../entites/Chat';
import { SendChatDto } from './dto/send-chat.dto';
import { getClovaAnswer } from '../common/api/naver';
import dayjs from 'dayjs';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(ChatRoom) private chatRoomRepository: Repository<ChatRoom>,
    private datasource: DataSource
  ) {}

  async createChat(sendChatDto: SendChatDto, user: User) {
    const answer = await getClovaAnswer(sendChatDto.message);
    const chat = new Chat();
    chat.chatRoomSeq = sendChatDto.chatRoomSeq;
    chat.question = sendChatDto.message;
    chat.answer = answer;
    chat.userSeq = user.seq;
    return await this.chatRepository.save(chat);
  }

  async createChatRoom(user: User) {
    const chatRoom = new ChatRoom();
    chatRoom.status = 'OPEN';
    chatRoom.userSeq = user.seq;
    return await this.chatRoomRepository.save(chatRoom);
  }

  async getOpenChat(userSeq: number) {
    const openChatRoom = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.chats', 'chats')
      .where('chatRoom.userSeq = :userSeq', { userSeq })
      .andWhere('chatRoom.status = "OPEN"')
      .getOne();
    if (!!openChatRoom) {
      const lastChat = await this.chatRepository
        .createQueryBuilder('chat')
        .where('chat.chatRoomSeq = :chatRoomSeq', { chatRoomSeq: openChatRoom.seq })
        .orderBy('chat.createdAt', 'DESC')
        .getOne();

      const diffDate = dayjs(new Date()).diff(lastChat.createdAt, 'minute', true);
      if (diffDate >= 30) {
        await this.chatRoomRepository
          .createQueryBuilder('chatRoom')
          .update()
          .set({ status: 'CLOSED' })
          .where('chatRoom.seq = :seq', { seq: openChatRoom.seq })
          .execute();
        return null;
      }
    }

    return openChatRoom;
  }

  getClosedChat(userSeq: number) {
    return this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .where('chatRoom.userSeq = :userSeq', { userSeq })
      .andWhere('chatRoom.status = "CLOSED"')
      .getMany();
  }

  getChatRoomDetail(seq: number) {
    return this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .leftJoinAndSelect('chatRoom.chats', 'chats')
      .where('chatRoom.seq = :seq', { seq })
      .getOne();
  }
}
