import { Inject, Injectable } from "@nestjs/common";
import * as llmPort from "../llm/llm.port.js";
import { CompleteParams } from "../llm/llm.port.js";

@Injectable()
export class ChatService {
  constructor(@Inject(llmPort.LLM) private readonly llm: llmPort.LlmPortType) {}

  async sendMessage (params: CompleteParams) {

    const {prompt} = params;
    return this.llm.complete({prompt})
  }
}