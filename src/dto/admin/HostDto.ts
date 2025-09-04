export interface HostResponseDto {
  id: string;
  name: string;
  listingCount: number;
  isRestricted: boolean;
}

export interface HostListResponseDto {
  data: HostResponseDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface HostQueryDto {
  page: number;
  limit: number;
}
