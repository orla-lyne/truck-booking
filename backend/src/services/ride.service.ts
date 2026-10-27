import { prisma } from '../config/prisma';
import { PricingService } from './pricing.services';

export class RideService {
  private pricing = new PricingService();

  async estimatePrice(distanceKm: number, truckSize: string) {
    return { price: this.pricing.calculatePrice(distanceKm, truckSize) };
  }

  async createRide(
    customerId: string,
    data: { pickupLocation: string; dropoffLocation: string; distanceKm: number; truckId: string }
  ) {
    const truck = await prisma.truck.findUnique({ where: { id: data.truckId } });
    if (!truck) throw new Error('Truck not found');

    const price = this.pricing.calculatePrice(data.distanceKm, truck.size);

    return prisma.ride.create({
      data: {
        customerId,
        truckId: truck.id,
        driverId: truck.driverId,
        pickupLocation: data.pickupLocation,
        dropoffLocation: data.dropoffLocation,
        distanceKm: data.distanceKm,
        price,
        status: 'REQUESTED',
      },
     include: {
  truck: true,
  driver: {
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
  },
},
    });
  }

  async getMyRides(userId: string, role: string) {
    if (role === 'CUSTOMER') {
      return prisma.ride.findMany({
        where: { customerId: userId },
        include: {
  driver: {
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, role: true } },
    },
  },
  truck: true,
},
        orderBy: { createdAt: 'desc' },
      });
    }
    const driver = await prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new Error('Driver profile not found');
    return prisma.ride.findMany({
      where: { driverId: driver.id },
     include: {
  customer: { select: { id: true, name: true, email: true, phone: true, role: true } },
  truck: true,
},
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(rideId: string, status: string, userId: string, role: string) {
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new Error('Ride not found');

    // Driver can only update their own rides
    if (role === 'DRIVER') {
      const driver = await prisma.driver.findUnique({ where: { userId } });
      if (!driver || ride.driverId !== driver.id) {
        throw new Error('You do not have permission for this ride');
      }
    }

    // Customer can only cancel their own requested rides
    if (role === 'CUSTOMER') {
      if (ride.customerId !== userId) throw new Error('You do not have permission for this ride');
      if (status !== 'CANCELLED') throw new Error('Customers can only cancel rides');
    }

    return prisma.ride.update({
      where: { id: rideId },
      data: { status: status as any },
    });
  }
}