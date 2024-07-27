import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';
import { getClovaAnswer } from '../common/api/naver';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '../entites/User';
import { SendChatDto } from './dto/send-chat.dto';
import { UserService } from '../user/user.service';
import { messageCombinePetInfo } from '../common/utils/utils';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService, private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '댕댕닥터 질문하기' })
  @Post()
  async createChat(@Body() sendChatDto: SendChatDto, @UserDecorator() user: User) {
    let petInfo;

    if (!!user) {
      petInfo = await this.userService.getPetInfo(user.seq);
      if (!!petInfo) {
        sendChatDto.message = messageCombinePetInfo(sendChatDto.message, petInfo);
      }
      if (!sendChatDto.chatRoomSeq) {
        const newChatRoom = await this.chatService.createChatRoom(user);
        sendChatDto.chatRoomSeq = newChatRoom.seq;
      }
      const savedChat = await this.chatService.createChat(sendChatDto, user);

      return { chatRoomSeq: sendChatDto.chatRoomSeq, answer: savedChat.answer };
    }

    const answer = await getClovaAnswer(sendChatDto.message);
    return { answer };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '열려있는 채팅방 조회' })
  @Get('chatRoom/open')
  async getOpenChatRoom(@UserDecorator() user: User) {
    return this.chatService.getOpenChat(user.seq);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '이전 채팅방 조회' })
  @Get('chatRoom/closed')
  async getClosedChatRom(@UserDecorator() user: User) {
    return this.chatService.getClosedChat(user.seq);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '채팅방 상세 조회' })
  @Get('chatRoom/:seq')
  async getChatRoomDetail(@Param('seq', ParseIntPipe) seq: number, @UserDecorator() user: User) {
    return this.chatService.getChatRoomDetail(seq);
  }
}
