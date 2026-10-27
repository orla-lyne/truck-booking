import { Router } from 'express';
import {
  createProfile,
  getMyProfile,
  listPending,
  verify,
  addTruck,
  availableTrucks,
} from '../controllers/driver.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Driver routes
router.post('/profile', authenticate, authorize('DRIVER'), createProfile);
router.get('/profile/me', authenticate, authorize('DRIVER'), getMyProfile);
router.post('/trucks', authenticate, authorize('DRIVER'), addTruck);

// Public-ish (any logged-in user can see approved trucks)
router.get('/available-trucks', authenticate, availableTrucks);

// Admin routes
router.get('/pending', authenticate, authorize('ADMIN'), listPending);
router.patch('/:id/verify', authenticate, authorize('ADMIN'), verify);

export default router;