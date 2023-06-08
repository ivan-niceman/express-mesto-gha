const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validateUserBody } = require('../middlewares/validate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const NotFound = require('../errors/notfound');

router.post('/signin', validateUserBody, login);
router.post('/signup', validateUserBody, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use(() => {
  throw new NotFound('Такой страницы не существует');
});

module.exports = router;
