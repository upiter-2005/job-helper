import { Body, Controller, Post, Res } from "@nestjs/common";
import type {Response} from 'express';
import { ChatService } from "./chat.service.js";
import { SendMessageDto } from "./chat.dto.js";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){};

    @Post('')
    async stream(@Body() params: SendMessageDto, @Res() res: Response) {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();

        const abort = new AbortController();
        
        res.on('close', () => {
            if (!res.writableEnded) abort.abort();
        });

        try {
            const id = await this.chatService.streamAnswer(
                params,
                (text) => res.write(`data: ${JSON.stringify({ text })}\n\n`),
                abort.signal,
            );
            res.write(`event: done\ndata:  ${JSON.stringify({ sessionId: id })}\n\n`);
        } catch (err) {
            if (!abort.signal.aborted) {
                res.write(`event: error\ndata: ${JSON.stringify({ message: 'Generation failed' })}\n\n`);
            }
        } finally {
            res.end();
        }
    }
}