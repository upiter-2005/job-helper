import { Module } from "@nestjs/common";
import { AnthropicLlmAdapter } from "./anthropic-llm.adapter.js";
import { LLM } from "./llm.port.js";

@Module({
    providers: [{provide: LLM, useClass: AnthropicLlmAdapter}],
    exports: [LLM]
})  
export class LlmModule {};