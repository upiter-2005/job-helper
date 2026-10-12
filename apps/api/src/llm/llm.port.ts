export const LLM = Symbol('LLM');

export type CompleteParams ={
    system?: string; 
    prompt: string;
}
export interface LlmPortType {
    complete(params: CompleteParams): Promise<string>;
}