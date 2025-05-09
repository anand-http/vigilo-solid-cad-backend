import express from 'express';
import {
    signIn, sendOtp, verifyOtp, resetPassword,
    singUpForGuard,
    singUpForClient, singUpForAdmin,
    guardsProfile, clientProfile,
    deleteUser,
    updateUser
} from './user_controller.js';
import { upload } from '../middleware/multer.js';

import isAuthenticated, { isAdmin } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/guard/signup').post(upload.single('avatar'), singUpForGuard);

router.route('/client/signup').post(upload.single('avatar'), singUpForClient);

router.route('/admin/signup').post(singUpForAdmin);
router.route('/signin').post(signIn);
router.route('/send-otp').post(sendOtp);
router.route('/verify-otp').post(verifyOtp);
router.route('/reset-password').put(resetPassword);
router.route('/get-guards').get(isAuthenticated, isAdmin, guardsProfile);
router.route('/get-clients').get(isAuthenticated, isAdmin, clientProfile);
router.route('/delete/:id').delete(isAuthenticated, isAdmin, deleteUser);
router.route('/update/:id').put(isAuthenticated, isAdmin, updateUser);


export default router;