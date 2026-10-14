import { Module } from "@nestjs/common";
import { HistoryService } from "./history.service.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConversationEntity } from "./conversation.entity.js";
import { MessageEntity } from "./message.entity.js";
import { MessageRepository } from "./message.repository.js";
import { ConversationRepository } from "./conversation.repository.js";


@Module({
    imports: [TypeOrmModule.forFeature([ConversationEntity, MessageEntity])],
    providers: [HistoryService, ConversationRepository, MessageRepository],
    exports:[HistoryService]
})
export class HistoryModule{}