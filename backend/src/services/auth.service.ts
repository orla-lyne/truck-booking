import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password.util';
import { signToken } from '../utils/jwt.util';
import { RegisterInput, LoginInput } from '../types/auth.type';

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('A user with this email already exists');

    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role || 'CUSTOMER',
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Invalid email or password');

    const valid = await comparePassword(data.password, user.password);
    if (!valid) throw new Error('Invalid email or password');

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return {
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, driverProfile: true },
    });
    if (!user) throw new Error('User not found');
    return user;
  }
}