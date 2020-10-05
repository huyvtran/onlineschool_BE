const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const isAuth = require('../middleware/is-auth');

router.post('/getMobileNumberwithUuid', authController.getMobileNumberwithUuid);
router.post('/mobilenumberExistsorNot', authController.mobilenumberExistsorNot);

router.post('/checkMpin', authController.checkMpin);
router.post('/changeMobilePin', authController.changeMobilePin);

router.post('/getTestData', authController.getTestData);


router.post('/generateOTP', authController.generateOTP);
router.post('/verifyOTP', authController.verifyOTP);
router.post('/resendOTP', authController.resendOTP);
router.post('/resetPassword', authController.resetPassword);
router.post('/loginWithMpin', authController.loginWithMpin);
router.post('/loginUser', authController.loginUser);
router.post('/changeuserpassword', authController.changeuserpassword);
router.post('/checkuuid', authController.checkuuid);
router.post('/getdatalogintype',authController.getdatabylogin);
module.exports = router;