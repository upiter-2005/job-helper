import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { APPLICATION_STATUS } from "../consts/application.consts.js";
import type { ApplicationStatus } from "../consts/application.consts.js";

@Entity({ name: "applications" })
export class ApplicationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    company: string;

    @Column({ type: "varchar", length: 255 })
    position: string;

    /** Ссылка на вакансию. Необязательна: пользователь может назвать только компанию и позицию. */
    @Column({ type: "text", nullable: true })
    url: string | null;

    @Column({ type: "varchar", length: 16, default: APPLICATION_STATUS.WISHLIST })
    status: ApplicationStatus;

    @Column({ type: "text", nullable: true })
    notes: string | null;

    /** Когда отклик реально отправлен. Заполняется при переходе в статус applied. */
    @Column({ type: "timestamptz", nullable: true })
    appliedAt: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;
}
