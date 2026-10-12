import { Module } from "@nestjs/common";
import { ChatModule } from "../chat/chat.module.js";
import { LlmModule } from "../llm/llm.module.js";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ChatModule, 
    LlmModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}