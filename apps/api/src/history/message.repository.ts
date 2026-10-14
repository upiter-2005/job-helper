import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity.js';

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


}