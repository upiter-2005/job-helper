import { Inject, Injectable, Logger } from "@nestjs/common";
import * as llmPort from "../llm/llm.port.js";
import { StreamParams } from "./chat.types.js";
import { HistoryService } from "../history/history.service.js";
import { randomUUID } from "node:crypto";
import { CONTEXT_CAPACITY, ROLES } from "../consts/llm.consts.js";

@Injectable()
export class ChatService {

  private readonly logger = new Logger(ChatService.name)

  constructor(
    @Inject(llmPort.LLM) private readonly llm: llmPort.LlmPortType,
    private historyService:HistoryService
  ) {}

  async streamAnswer(params: StreamParams, onText: (text: string) => void, signal?: AbortSignal) {
    const {sessionId, prompt} = params;
    const id = sessionId || randomUUID();
    const history = await this.historyService.getHistory(id);
    const contextSize = await this.historyService.getContextSize(id);

    if(contextSize > CONTEXT_CAPACITY){this.logger.warn(`Session ${id}: context ${contextSize}/${CONTEXT_CAPACITY}`)}

    const messages = [...history, {role: ROLES.USER, content: prompt}]
    let buffer = '';
    const {inputTokens, outputTokens} = await this.llm.stream( {messages}, (text) => { buffer += text; onText(text);} , signal);
    await this.historyService.setHistory( id, prompt, buffer, inputTokens, outputTokens);
    
    return id;
  }

}