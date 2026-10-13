import { Inject, Injectable } from "@nestjs/common";
import * as llmPort from "../llm/llm.port.js";
import { StreamParams } from "./chat.types.js";
import { HistoryService } from "../history/history.service.js";
import { randomUUID } from "node:crypto";

@Injectable()
export class ChatService {
  constructor(
    @Inject(llmPort.LLM) private readonly llm: llmPort.LlmPortType,
    private historyService:HistoryService
  ) {}

  async streamAnswer(params: StreamParams, onText: (text: string) => void, signal?: AbortSignal) {
    const {sessionId, prompt} = params;
    const id = sessionId || randomUUID();
    const history = this.historyService.getHistory(id);
    const messages: llmPort.Message[] = [...history, {role: 'user', content: prompt}]
    let buffer = '';

    await this.llm.stream( {messages}, (text) => { buffer += text; onText(text);} , signal);
    this.historyService.setHistory( id, prompt, buffer );
    
    return id;
  }

}