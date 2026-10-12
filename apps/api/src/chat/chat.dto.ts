import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class SendMessageDto {
    @IsString()
    @IsOptional()
    sessionId?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    prompt: string;
}