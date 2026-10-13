import { Injectable } from "@nestjs/common";
import * as llmPort from "../llm/llm.port.js";
import { ROLES } from "../consts/llm.consts.js";

@Injectable()
export class HistoryService {
    constructor() {}

    private readonly store = new Map<string, {messages:llmPort.Message[], contextSize: number}>()

    getHistory(sessionId: string):llmPort.Message[]{
  
        return this.store.get(sessionId)?.messages ?? [];
    }

    setHistory(sessionId:string, userMessage: string, assistantMessage: string, inputTokens: number, outputTokens: number): void{

        const contextSize = inputTokens + outputTokens;
        const existingHistory = this.getHistory(sessionId);

        this.store.set(sessionId, 
            {
                messages: [
                    ...existingHistory,
                    {role: ROLES.USER, content: userMessage},
                    {role: ROLES.ASSISTANT, content: assistantMessage}
                ],
                contextSize
            }
            
        )
    }  
    
    getContextSize (sessionId: string): number {
        return this.store.get(sessionId)?.contextSize ?? 0;
    }

}