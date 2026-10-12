export const LLM = Symbol('LLM');

export type Role = "user" | "assistant";

export type Message = {
    role: Role;
    content: string;
}

export type CompleteParams ={
    system?: string; 
    prompt: Message[];
}
export interface LlmPortType {
    complete(params: CompleteParams): Promise<string>;
}