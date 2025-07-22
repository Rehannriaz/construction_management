import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from '../core/User';
import { Site } from '../sites/Site';
import { MessageRecipient } from './MessageRecipient';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid', { name: 'message_id' })
  messageId: string;

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId: string;

  @Column({ name: 'recipient_id', type: 'uuid', nullable: true })
  recipientId: string | null;

  @Column({ name: 'site_id', type: 'uuid', nullable: true })
  siteId: string | null;

  @Column({ name: 'parent_message_id', type: 'uuid', nullable: true })
  parentMessageId: string | null;

  @Column({ name: 'subject', type: 'varchar', length: 255, nullable: true })
  subject: string | null;

  @Column({ name: 'message_body', type: 'text' })
  messageBody: string;

  @Column({ name: 'message_type', type: 'varchar', length: 50, default: 'direct' })
  messageType: string;

  @Column({ name: 'priority', type: 'varchar', length: 20, default: 'normal' })
  priority: string;

  @Column({ name: 'attachment_url', type: 'text', nullable: true })
  attachmentUrl: string | null;

  @Column({ name: 'attachment_filename', type: 'varchar', length: 255, nullable: true })
  attachmentFilename: string | null;

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamptz', nullable: true })
  readAt: Date | null;

  @Column({ name: 'sent_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User | null;

  @ManyToOne(() => Site, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'site_id' })
  site: Site | null;

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'parent_message_id' })
  parentMessage: Message | null;

  @OneToMany(() => MessageRecipient, (messageRecipient) => messageRecipient.message)
  messageRecipients: MessageRecipient[];
}