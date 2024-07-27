import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../entites/Chat';
import { ChatRoom } from '../entites/ChatRoom';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatRoom]), UserModule],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
