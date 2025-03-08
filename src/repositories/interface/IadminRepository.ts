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

interface Reservation {
    id: string;
    guestName: string;
    startDate: string;
    endDate: string;
    hostName: string;
    propertyName: string;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
}

interface DashboardStats {
    totalUsers: number;
    totalBookings: number;
    totalListings: number;
    monthlyBookings: Array<{ month: string; bookings: number }>;
}

interface AdminRepository {
    findByEmail(email: string): Promise<Admin | null>;
    getAllUsers(page?: number, limit?: number): Promise<PaginatedResponse<User>>;
    blockUser(userId: string): Promise<User | null>;
    unblockUser(userId: string): Promise<User | null>;

    // New method for fetching reservations
    getAllReservations(page?: number, limit?: number): Promise<PaginatedResponse<Reservation>>;

    //dashboard
    getDashboardStats(): Promise<DashboardStats>;
    getAllHosts(page?: number, limit?: number): Promise<PaginatedResponse<{ id: string; name: string; listingCount: number; isRestricted: boolean }>>;
}

export default AdminRepository;
