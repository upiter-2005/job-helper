import {ROLES} from "../consts/llm.consts.js"

export const LLM = Symbol('LLM');

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type Message = {
    role: Role;
    content: string;
}

export type CompleteParams ={
    system?: string; 
    messages: Message[];
}

export interface LlmPortType {
    complete(params: CompleteParams): Promise<string>;
    stream(
        params: CompleteParams,
        onText: (text: string) => void,
        signal?: AbortSignal,
    ): Promise<{inputTokens: number, outputTokens: number}>;
}