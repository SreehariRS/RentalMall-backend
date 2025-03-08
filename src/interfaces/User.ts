export interface User {
    id: string;
    name: string | null; // Allow name to be null as per your schema
    email: string;
    isBlocked: boolean;
    image: string | null;
  }