import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import type { Relation } from "typeorm";
import type { Role } from "../llm/llm.port.js";
import { ConversationEntity } from "./conversation.entity.js";

@Entity({ name: "messages" })
@Index(["conversationId", "id"])
export class MessageEntity {
    /** Порядок сообщений в диалоге определяется по возрастанию id. */
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "uuid" })
    conversationId: string;

    @ManyToOne(() => ConversationEntity, (conversation) => conversation.messages, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "conversationId" })
    conversation: Relation<ConversationEntity>;

    @Column({ type: "varchar", length: 16 })
    role: Role;

    @Column({ type: "text" })
    content: string;

    /** Расход токенов хранится только у ответов ассистента (usage относится к ходу). */
    @Column({ type: "int", nullable: true })
    inputTokens: number | null;

    @Column({ type: "int", nullable: true })
    outputTokens: number | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;
}
