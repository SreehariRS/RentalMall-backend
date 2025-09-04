export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isRestricted: boolean;
  image: string | null;
}

export interface UserListResponseDto {
  data: UserResponseDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface UserBlockRequestDto {
  userId: string;
}

export interface UserBlockResponseDto {
  message: string;
  user: UserResponseDto;
}

export interface UserSearchQueryDto {
  page: number;
  limit: number;
  searchQuery?: string;
}
