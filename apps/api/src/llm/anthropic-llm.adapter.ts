import { Injectable } from "@nestjs/common";
import { CompleteParams, LlmPortType } from "./llm.port.js";
import Anthropic from "@anthropic-ai/sdk";
import { ConfigService } from "@nestjs/config";
import { SYSTEM } from "../consts/llm.consts.js";

@Injectable()
export class AnthropicLlmAdapter implements LlmPortType {

    constructor (private config: ConfigService){
        this.client = new Anthropic({
        apiKey: this.config.getOrThrow<string>("ANTHROPIC_API_KEY"),
    });
    }
    
    private readonly client;

    async complete(params: CompleteParams){
        const {messages, system} = params;

        const message = await this.client.messages.create({
            model: "claude-haiku-5-5",
            max_tokens: 300,
            system: system || SYSTEM ,
            messages
        });

        const result = message.content.find(el => el.type === "text") 

        if(!result) throw new Error(`Error without text, stop_reason=${message.stop_reason}`);

        return result.text ;
    }


    async stream (params: CompleteParams, onText: (text: string) => void, signal?: AbortSignal) {
        const {messages, system} = params;

        const streamResponse = this.client.messages.stream({
            model: "claude-haiku-5-5",
            max_tokens: 300,
            system: system || SYSTEM ,
            messages
        });

        const onAbort = () => streamResponse.abort();
        if(signal?.aborted) onAbort();
        signal?.addEventListener('abort', onAbort, {once: true});

        try {
            for await (const chunk of streamResponse) {
                if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                    onText(chunk.delta.text);
                }
            }
        } finally {
            signal?.removeEventListener('abort', onAbort);
        }
        
    }
}