import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicationEntity } from "./application.entity.js";
import { ApplicationRepository } from "./application.repository.js";
import { ApplicationsService } from "./applications.service.js";

@Module({
    imports: [TypeOrmModule.forFeature([ApplicationEntity])],
    providers: [ApplicationsService, ApplicationRepository],
    exports: [ApplicationsService],
})
export class ApplicationsModule {}
