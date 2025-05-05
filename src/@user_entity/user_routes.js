import express from 'express';
import { signIn, sendOtp, verifyOtp, resetPassword, singUpForGuard, singUpForClient, singUpForAdmin } from './user_controller.js';

const router = express.Router();


router.route('/guard/signup').post(singUpForGuard);
router.route('/client/signup').post(singUpForClient);
router.route('/admin/signup').post(singUpForAdmin);
router.route('/signin').post(signIn);
router.route('/send-otp').post(sendOtp);
router.route('/verify-otp').post(verifyOtp);
router.route('/reset-password').post(resetPassword);


export default router;