import { User } from '@prisma/client';

export interface UserPayload extends User {}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
