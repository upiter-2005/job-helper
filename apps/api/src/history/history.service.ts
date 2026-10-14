import { Injectable } from "@nestjs/common";
import * as llmPort from "../llm/llm.port.js";
import { MessageRepository } from "./message.repository.js";
import { ConversationRepository } from "./conversation.repository.js";

@Injectable()
export class HistoryService {
    constructor(
        private messageRepository: MessageRepository,
        private conversationRepository: ConversationRepository
    ) {}


    async getHistory(sessionId: string): Promise<llmPort.Message[]>{
        const response =  await this.messageRepository.findByConversation(sessionId);
        const messages = response.map(el => ({ role: el.role , content: el.content}) );

        return messages;
    }

    async setHistory(sessionId:string, userMessage: string, assistantMessage: string, inputTokens: number, outputTokens: number): Promise<void>{
        
        const existConversation = await this.conversationRepository.findOneById(sessionId);

        if(!existConversation){
            await this.conversationRepository.createAndSave(sessionId);
        }

        const userContent = this.messageRepository.createUserMessage(sessionId, userMessage);
        const assistantContent = this.messageRepository.createAssistantMessage(sessionId, assistantMessage, inputTokens, outputTokens);

        await this.messageRepository.savePairMessages(userContent, assistantContent);
       
    }  
    
    async getContextSize (sessionId: string): Promise<number> {
        const [message] = await this.messageRepository.findLastMessage(sessionId);
        const size =( message?.outputTokens || 0 )+ (message?.inputTokens || 0)
        return size;
    }

}