import { Response, NextFunction } from 'express';
import { RideService } from '../services/ride.service';
import { AuthRequest } from '../middleware/auth.middleware';

const rideService = new RideService();

export const estimate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await rideService.estimatePrice(Number(req.body.distanceKm), req.body.truckSize);
    res.json(result);
  } catch (e) { next(e); }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ride = await rideService.createRide(req.user!.userId, req.body);
    res.status(201).json({ message: 'Ride requested', ride });
  } catch (e) { next(e); }
};

export const myRides = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const rides = await rideService.getMyRides(req.user!.userId, req.user!.role);
    res.json({ rides });
  } catch (e) { next(e); }
};

export const updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ride = await rideService.updateStatus(
      req.params.id,
      req.body.status,
      req.user!.userId,
      req.user!.role
    );
    res.json({ message: 'Ride updated', ride });
  } catch (e) { next(e); }
};