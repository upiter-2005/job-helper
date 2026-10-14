import { Injectable } from "@nestjs/common";
import * as llmPort from "../llm/llm.port.js";
import { ROLES } from "../consts/llm.consts.js";
import { MessageRepository } from "./message.repository.js";
import { ConversationRepository } from "./conversation.repository.js";

@Injectable()
export class HistoryService {
    constructor(
        private messageRepository: MessageRepository,
        private conversationRepository: ConversationRepository
    ) {}

    private readonly store = new Map<string, {messages:llmPort.Message[], contextSize: number}>()


    async getHistory(sessionId: string): Promise<llmPort.Message[]>{
        const response =  await this.messageRepository.findByConversation(sessionId);
        const messages  = response.map(el => ({ role: el.role , content: el.content}) );
        return messages;
        
        //return this.store.get(sessionId)?.messages ?? [];
    }

    async setHistory(sessionId:string, userMessage: string, assistantMessage: string, inputTokens: number, outputTokens: number): Promise<void>{

        const contextSize = inputTokens + outputTokens;
        const existingHistory = await this.getHistory(sessionId);

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