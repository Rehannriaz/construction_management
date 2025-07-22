import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { UserRole } from '../../types/enums';
import { SiteDocument } from './SiteDocument';
import { User } from '../core/User';

@Entity({ name: 'document_permissions' })
export class DocumentPermission {
  @PrimaryGeneratedColumn('uuid', { name: 'permission_id' })
  permissionId: string;

  @Column({ name: 'document_id', type: 'uuid' })
  documentId: string;

  @Column({ name: 'role', type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'can_view', type: 'boolean', default: true })
  canView: boolean;

  @Column({ name: 'can_download', type: 'boolean', default: true })
  canDownload: boolean;

  @Column({ name: 'can_edit', type: 'boolean', default: false })
  canEdit: boolean;

  @Column({ name: 'granted_by_user_id', type: 'uuid' })
  grantedByUserId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => SiteDocument, (document) => document.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: SiteDocument;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'granted_by_user_id' })
  grantedBy: User;
}