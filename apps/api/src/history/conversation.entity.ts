import { CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import type { Relation } from "typeorm";
import { MessageEntity } from "./message.entity.js";

@Entity({ name: "conversations" })
export class ConversationEntity {
    /** Это и есть sessionId, который мы отдаём клиенту (uuid генерирует сервер). */
    @PrimaryColumn({ type: "uuid" })
    id: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @OneToMany(() => MessageEntity, (message) => message.conversation)
    messages: Relation<MessageEntity[]>;
}
