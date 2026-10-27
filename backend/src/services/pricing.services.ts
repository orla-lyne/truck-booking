type TruckSize = 'SMALL' | 'MEDIUM' | 'LARGE';

const BASE_FARE = 500;
const PER_KM_RATE: Record<TruckSize, number> = {
  SMALL: 150,
  MEDIUM: 250,
  LARGE: 400,
};

export class PricingService {
  calculatePrice(distanceKm: number, truckSize: string): number {
    const size = (truckSize.toUpperCase() as TruckSize) || 'SMALL';
    const rate = PER_KM_RATE[size] || PER_KM_RATE.SMALL;
    return Math.round(BASE_FARE + distanceKm * rate);
  }
}