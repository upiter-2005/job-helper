import { Body, Controller, Post } from "@nestjs/common";
import { ChatService } from "./chat.service.js";
import { SendMessageDto } from "./chat.dto.js";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){};

    @Post()
    async sendMessage(@Body() payload: SendMessageDto): Promise<string>{

        const {sessionId, prompt} = payload;
        const response = await this.chatService.sendMessage(prompt, sessionId);

        return response;
    }
}