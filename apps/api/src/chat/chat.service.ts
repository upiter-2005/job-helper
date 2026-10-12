import { Inject, Injectable } from "@nestjs/common";
import * as llmPort from "../llm/llm.port.js";

@Injectable()
export class ChatService {
  constructor(@Inject(llmPort.LLM) private readonly llm: llmPort.LlmPortType) {}

  async sendMessage (prompt: string, sessionId?: string) {

    //return UUID 
    //create history
    if(sessionId){ console.log(sessionId, prompt) }


//here will be store messages
    return this.llm.complete({ messages: []})
  }
}