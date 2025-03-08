
export interface Admin {
    id: string;
    email: string;
    password: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
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
  