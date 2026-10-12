import { Body, Controller, Post } from "@nestjs/common";
import { ChatService } from "./chat.service.js";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){};

    @Post()
    async sendMessage(@Body() payload: any): Promise<string>{

        const {prompt} = payload;
        const response = await this.chatService.sendMessage({system: '', messages: prompt})

        return response;
    }
}