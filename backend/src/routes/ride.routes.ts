import { Router } from 'express';
import { estimate, create, myRides, updateStatus } from '../controllers/ride.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/estimate', authenticate, estimate);
router.post('/', authenticate, create);
router.get('/my', authenticate, myRides);
router.patch('/:id/status', authenticate, updateStatus);

export default router;