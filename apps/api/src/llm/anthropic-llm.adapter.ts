import { Injectable, Logger } from "@nestjs/common";
import { CompleteParams, LlmPortType } from "./llm.port.js";
import Anthropic from "@anthropic-ai/sdk";
import { ConfigService } from "@nestjs/config";
import { MAX_INPUT_TOKENS, MODEL, SYSTEM } from "../consts/llm.consts.js";

@Injectable()
export class AnthropicLlmAdapter implements LlmPortType {

    private readonly logger = new Logger(AnthropicLlmAdapter.name);

    constructor (private config: ConfigService){
        this.client = new Anthropic({
        apiKey: this.config.getOrThrow<string>("ANTHROPIC_API_KEY"),
    });
    }
    
    private readonly client;

    async complete(params: CompleteParams){
        const {messages, system} = params;

        const message = await this.client.messages.create({
            model: MODEL,
            max_tokens: MAX_INPUT_TOKENS,
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
            model: MODEL,
            max_tokens: MAX_INPUT_TOKENS,
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
            const final = await streamResponse.finalMessage();
            const {input_tokens, output_tokens}= final.usage;
            this.logger.log(`usage: in=${input_tokens} out=${output_tokens}`);
            
            return {inputTokens: input_tokens, outputTokens: output_tokens}
        } finally {
            signal?.removeEventListener('abort', onAbort);
        }
        
    }
}