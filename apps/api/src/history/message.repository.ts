import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity.js';
import { ROLES } from '../consts/llm.consts.js';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly repository: Repository<MessageEntity>,
  ) {}

  async findByConversation(conversationId: string): Promise<MessageEntity[]>{
    return await this.repository.find({
      where: {conversationId},
      order: {
        id: "ASC"
      }
    })
  }

  async findLastMessage(conversationId: string): Promise<MessageEntity[]>{
    return await this.repository.find({
      where: { conversationId },
      order: { id: 'DESC' },
      take: 1,
    })
  }

  createUserMessage(sessionId:string, userMessage: string):MessageEntity {
    return this.repository.create({
      conversationId: sessionId,
      role: ROLES.USER,
      content: userMessage
    })
  }

  createAssistantMessage(sessionId:string, assistantMessage: string, inputTokens: number, 
    outputTokens: number):MessageEntity {
    return this.repository.create({
      conversationId: sessionId,
      role: ROLES.ASSISTANT,
      content: assistantMessage,
      inputTokens,
      outputTokens
    })
  }

  async savePairMessages(userMessage: MessageEntity, assistantMessage: MessageEntity): Promise<MessageEntity[]>{
    return this.repository.save([userMessage, assistantMessage])
  }



}