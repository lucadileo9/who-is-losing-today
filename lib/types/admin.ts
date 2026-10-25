import { Role, BugCategory, BugPriority, BugStatus } from '@prisma/client';
import { UserSummaryDTO } from './user';

export interface WhitelistDTO {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface BugReportDTO {
  id: string;
  userId: string;
  author: UserSummaryDTO;
  description: string;
  category: BugCategory;
  priority: BugPriority;
  status: BugStatus;
  createdAt: string;
}
