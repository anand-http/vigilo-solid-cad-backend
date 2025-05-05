import express from 'express';
import { shiftAllotment } from './shift_controller.js';
import isAuthenticated, { isAdmin } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/assign').post(isAuthenticated,isAdmin,shiftAllotment);

export default router;