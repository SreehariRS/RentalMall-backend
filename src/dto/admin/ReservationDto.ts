export interface ReservationResponseDto {
  id: string;
  guestName: string;
  startDate: string;
  endDate: string;
  hostName: string;
  propertyName: string;
}

export interface ReservationListResponseDto {
  data: ReservationResponseDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface ReservationQueryDto {
  page: number;
  limit: number;
}
