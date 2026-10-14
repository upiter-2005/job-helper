import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from './conversation.entity.js';

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly repository: Repository<ConversationEntity>,
  ) {}


  async findOneById(id: string): Promise<ConversationEntity | null>{
    return this.repository.findOneBy({id})
  }

  async createAndSave(id: string):Promise<ConversationEntity> {
    const conversation = this.repository.create({id});
    return this.repository.save(conversation);
  }

}