import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}