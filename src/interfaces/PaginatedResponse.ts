import { User } from './User';

export interface PaginatedResponse {
  users: User[];
  total: number;
  currentPage: number;
  totalPages: number;
}