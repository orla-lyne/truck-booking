import { Response, NextFunction } from 'express';
import { DriverService } from '../services/driver.service';
import { AuthRequest } from '../middleware/auth.middleware';

const driverService = new DriverService();

export const createProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const driver = await driverService.createDriverProfile(req.user!.userId, req.body);
    res.status(201).json({ message: 'Driver profile created', driver });
  } catch (e) { next(e); }
};

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const driver = await driverService.getDriverProfile(req.user!.userId);
    res.json({ driver });
  } catch (e) { next(e); }
};

export const listPending = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const drivers = await driverService.listPendingDrivers();
    res.json({ drivers });
  } catch (e) { next(e); }
};

export const verify = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const driver = await driverService.verifyDriver(req.params.id, req.body.status);
    res.json({ message: `Driver ${req.body.status.toLowerCase()}`, driver });
  } catch (e) { next(e); }
};

export const addTruck = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const truck = await driverService.addTruck(req.user!.userId, req.body);
    res.status(201).json({ message: 'Truck added', truck });
  } catch (e) { next(e); }
};

export const availableTrucks = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const trucks = await driverService.listAvailableTrucks();
    res.json({ trucks });
  } catch (e) { next(e); }
};