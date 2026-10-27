export type TruckSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface Truck {
  id: string;
  size: TruckSize;
  plateNumber: string;
}

export interface Ride {
  id: string;
  customerId: string;
  driverId?: string;
  truckId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  distanceKm: number;
  price: number;
  status: 'REQUESTED' | 'ACCEPTED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  truck?: Truck;
  driver?: { user?: { name: string; phone: string } };
  customer?: { name: string; phone: string };
}