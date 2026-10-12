import { Inject, Injectable } from "@nestjs/common";
import * as llmPort from "../llm/llm.port.js";
import { StreamParams } from "./chat.types.js";

@Injectable()
export class ChatService {
  constructor(@Inject(llmPort.LLM) private readonly llm: llmPort.LlmPortType) {}

  async sendMessage (prompt: string, sessionId?: string) {

    //return UUID 
    //create history
    if(sessionId){ console.log(sessionId, prompt) }


//here will be store messages
    return this.llm.complete({ messages: []});
  }

  streamAnswer(params: StreamParams, onText: (text: string) => void, signal?: AbortSignal) {
    const {sessionId, prompt} = params;
    const history = new Map();


    if(!sessionId){
      let uuid = self.crypto.randomUUID();
      history.set(uuid, {role: "user", content: prompt});
      //createConversation()
      //createMessageInDb()
     }

    return this.llm.stream( {messages: []}, onText, signal);
  }

}