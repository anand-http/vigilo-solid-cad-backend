import express from 'express';
import { upload } from '../middleware/multer.js';
import { createOrder } from './order_controller.js';

const router = express.Router();


router.route('/create-orders').post(upload.array('images',7), createOrder);


export default router;