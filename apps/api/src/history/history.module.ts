import { Module } from "@nestjs/common";
import { HistoryService } from "./history.service.js";
import { LlmModule } from "../llm/llm.module.js";


@Module({
    //imports: [LlmModule],
    //controllers: [ChatController],
    providers: [HistoryService],
    exports:[HistoryService]
})
export class HistoryModule{}