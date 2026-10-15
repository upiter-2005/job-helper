import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationEntity } from './application.entity.js';
import {
  ApplicationRepository,
  type CreateApplicationData,
} from './application.repository.js';
import { APPLICATION_STATUS } from '../consts/application.consts.js';
import type { ApplicationStatus } from '../consts/application.consts.js';

@Injectable()
export class ApplicationsService {
  constructor(private applicationRepository: ApplicationRepository) {}

  async save(data: CreateApplicationData): Promise<ApplicationEntity> {
    return this.applicationRepository.createAndSave(data);
  }

  async list(status?: ApplicationStatus): Promise<ApplicationEntity[]> {
    return this.applicationRepository.findAll(status);
  }

  async updateStatus(id: number, status: ApplicationStatus): Promise<ApplicationEntity> {
    const application = await this.applicationRepository.findOneById(id);

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    application.status = status;

    // appliedAt фиксируем один раз — при первом переходе в applied
    if (status === APPLICATION_STATUS.APPLIED && !application.appliedAt) {
      application.appliedAt = new Date();
    }

    return this.applicationRepository.save(application);
  }
}
