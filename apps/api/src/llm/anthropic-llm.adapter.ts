import { Injectable } from "@nestjs/common";
import { CompleteParams, LlmPortType } from "./llm.port.js";
import Anthropic from "@anthropic-ai/sdk";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AnthropicLlmAdapter implements LlmPortType {

    constructor (private config: ConfigService){
        this.client = new Anthropic({
        apiKey: this.config.get<string>("ANTHROPIC_API_KEY"),
    });
    }
    
    private readonly client;

    async complete(params: CompleteParams){
        const {prompt} = params;

        const message = await this.client.messages.create({
            model: "claude-haiku-5-5",
            max_tokens: 300,
            system: "use short explanation responses",
            messages: [{ role: "user", content: prompt}]
        });

        const result = message.content.find(el => el.type === "text") 

        console.log(message);
        if(!result) throw new Error(`Error without text, stop_reason=${message.stop_reason}`);

        return result.text ;
    }
}