import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        email:string;
        role:string;
        id:string
      };  // or you can use a more complex type for user, if needed
    }
  }
}
