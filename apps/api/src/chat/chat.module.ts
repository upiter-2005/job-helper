import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service.js";
import { ChatController } from "./chat.controller.js";
import { LlmModule } from "../llm/llm.module.js";
import { HistoryModule } from "../history/history.module.js";

@Module({
    imports: [LlmModule, HistoryModule],
    controllers: [ChatController],
    providers: [ChatService]
})
export class ChatModule{}