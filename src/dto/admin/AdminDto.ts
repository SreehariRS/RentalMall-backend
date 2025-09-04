export interface AdminLoginRequestDto {
  email: string;
  password: string;
}

export interface AdminLoginResponseDto {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface AdminRefreshRequestDto {
  refreshToken: string;
}

export interface AdminRefreshResponseDto {
  message: string;
  accessToken: string;
}

export interface AdminResponseDto {
  id: string;
  email: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface AdminCreateRequestDto {
  email: string;
  password: string;
  role: string;
}

export interface AdminUpdateRequestDto {
  email?: string;
  role?: string;
}
