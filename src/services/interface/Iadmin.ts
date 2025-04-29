export interface Admin {
  id: string;
  email: string;
  password: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isRestricted: boolean;
  image: string | null;
}

export interface Reservation {
  id: string;
  guestName: string;
  startDate: string;
  endDate: string;
  hostName: string;
  propertyName: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalListings: number;
  totalHosts: number;
  usersGrowth: number;
  bookingsGrowth: number;
  listingsGrowth: number;
  hostsGrowth: number;
  monthlyBookings: Array<{ month: string; bookings: number }>;
  bookingsByCategory: Array<{ name: string; value: number }>;
  listingsByCategory: Array<{ name: string; value: number }>;
}

// Service Interfaces
export interface IAuthService {
  findByEmail(email: string): Promise<Admin | null>;
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string } | null>;
  refreshToken(refreshToken: string): Promise<{ accessToken: string } | null>;
}

export interface INotificationService {
  sendNotification(userId: string, message: string, type: string): Promise<void>;
}

export interface IUserService {
  getAllUsers(page: number, limit: number, search?: string): Promise<PaginatedResponse<User>>;
  blockUser(userId: string): Promise<User | null>;
  unblockUser(userId: string): Promise<User | null>;
  restrictHost(userId: string): Promise<User | null>;
  unrestrictHost(userId: string): Promise<User | null>;
}

export interface IReservationService {
  getAllReservations(page: number, limit: number): Promise<PaginatedResponse<Reservation>>;
}

export interface IHostService {
  getAllHosts(page: number, limit: number): Promise<PaginatedResponse<{ id: string; name: string; listingCount: number; isRestricted: boolean }>>;
}

export interface IDashboardService {
  getDashboardStats(): Promise<DashboardStats>;
}