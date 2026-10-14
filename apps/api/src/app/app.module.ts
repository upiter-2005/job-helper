import { Module } from "@nestjs/common";
import { ChatModule } from "../chat/chat.module.js";
import { LlmModule } from "../llm/llm.module.js";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        url: config.getOrThrow<string>("DATABASE_URL"),
        // Сущности подтягиваются из модулей, где есть TypeOrmModule.forFeature([...]).
        autoLoadEntities: true,
        // Схема создаётся по сущностям. Только для разработки: на этапе 3, когда схема
        // начнёт меняться, перейдём на миграции.
        synchronize: config.get("NODE_ENV") !== "production",
      }),
    }),
    ChatModule, 
    LlmModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}