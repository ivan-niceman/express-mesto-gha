const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUser);
router.get('/users/me', usersController.getUserInfo);
router.get('/:userId', usersController.getUserById);
router.patch('/me', usersController.updateProfile);
router.patch('/me/avatar', usersController.updateAvatar);

module.exports = router;
