const router = require('express').Router();
const { validateEditUserInfo, validateEditUserAvatar, validationUserId } = require('../middlewares/validate');
const usersController = require('../controllers/users');

router.get('/', usersController.getUser);

router.get('/me', usersController.getUserInfo);

router.get('/:userId', validationUserId, usersController.getUserById);

router.patch('/me', validateEditUserInfo, usersController.updateProfile);

router.patch('/me/avatar', validateEditUserAvatar, usersController.updateAvatar);

module.exports = router;
