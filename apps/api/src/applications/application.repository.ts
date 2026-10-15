import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationEntity } from './application.entity.js';
import type { ApplicationStatus } from '../consts/application.consts.js';

export type CreateApplicationData = {
  company: string;
  position: string;
  url?: string | null;
  notes?: string | null;
};

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly repository: Repository<ApplicationEntity>,
  ) {}

  async createAndSave(data: CreateApplicationData): Promise<ApplicationEntity> {
    const application = this.repository.create(data);
    return this.repository.save(application);
  }

  async findAll(status?: ApplicationStatus): Promise<ApplicationEntity[]> {
    return this.repository.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: number): Promise<ApplicationEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async save(application: ApplicationEntity): Promise<ApplicationEntity> {
    return this.repository.save(application);
  }
}
