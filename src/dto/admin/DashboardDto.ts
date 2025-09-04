export interface DashboardStatsResponseDto {
  totalUsers: number;
  totalBookings: number;
  totalListings: number;
  totalHosts: number;
  usersGrowth: number;
  bookingsGrowth: number;
  listingsGrowth: number;
  hostsGrowth: number;
  monthlyBookings: MonthlyBookingDto[];
  bookingsByCategory: CategoryStatDto[];
  listingsByCategory: CategoryStatDto[];
}

export interface MonthlyBookingDto {
  month: string;
  bookings: number;
}

export interface CategoryStatDto {
  name: string;
  value: number;
}
