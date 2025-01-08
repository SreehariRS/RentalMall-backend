interface Admin {
  id: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  image: string | null;
}

interface PaginatedResponse {
  users: User[];
  total: number;
  currentPage: number;
  totalPages: number;
}

interface AdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  getAllUsers(page?: number, limit?: number): Promise<PaginatedResponse>;
  blockUser(userId: string): Promise<User | null>;
  unblockUser(userId: string): Promise<User | null>;
}

export default AdminRepository;