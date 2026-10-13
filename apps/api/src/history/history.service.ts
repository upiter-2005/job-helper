import { Injectable } from "@nestjs/common";
import * as llmPort from "../llm/llm.port.js";
import { ROLES } from "../consts/llm.consts.js";

@Injectable()
export class HistoryService {
    constructor() {}

    private readonly store = new Map<string, llmPort.Message[]>()

    getHistory(sessionId: string):llmPort.Message[]{
  
        return this.store.get(sessionId) ?? [];
    }

    setHistory(sessionId:string, userMessage: string, assistantMessage: string): void{
        const existingHistory = this.getHistory(sessionId);
        this.store.set(sessionId, 
            [
                ...existingHistory,
                {role: ROLES.USER, content: userMessage},
                {role: ROLES.ASSISTANT, content: assistantMessage}
            ]
        )
    }   

}