import { prisma } from '../config/prisma';

export class DriverService {
  async createDriverProfile(
    userId: string,
    data: { licenseNumber: string; trucks?: { size: string; plateNumber: string }[] }
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    if (user.role !== 'DRIVER') throw new Error('User must be a driver');

    const existing = await prisma.driver.findUnique({ where: { userId } });
    if (existing) throw new Error('Driver profile already exists');

    return prisma.driver.create({
      data: {
        userId,
        licenseNumber: data.licenseNumber,
        trucks: data.trucks
          ? { create: data.trucks.map((t) => ({ size: t.size, plateNumber: t.plateNumber })) }
          : undefined,
      },
      include: { trucks: true, user: { select: { id: true, name: true, email: true } } },
    });
  }

  async getDriverProfile(userId: string) {
    const driver = await prisma.driver.findUnique({ where: { userId }, include: { trucks: true } });
    if (!driver) throw new Error('Driver profile not found');
    return driver;
  }

  async listPendingDrivers() {
    return prisma.driver.findMany({
      where: { verificationStatus: 'PENDING' },
      include: { user: { select: { id: true, name: true, email: true, phone: true } }, trucks: true },
    });
  }

  async verifyDriver(driverId: string, status: 'APPROVED' | 'REJECTED') {
    return prisma.driver.update({ where: { id: driverId }, data: { verificationStatus: status } });
  }

  async addTruck(userId: string, data: { size: string; plateNumber: string }) {
    const driver = await prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new Error('Driver profile not found');
    return prisma.truck.create({ data: { driverId: driver.id, size: data.size, plateNumber: data.plateNumber } });
  }

  async listAvailableTrucks() {
    return prisma.truck.findMany({
      where: { driver: { verificationStatus: 'APPROVED' } },
      include: { driver: { include: { user: { select: { id: true, name: true, phone: true } } } } },
    });
  }
}