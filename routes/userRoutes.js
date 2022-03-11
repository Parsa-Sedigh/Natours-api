const express = require('express');
const userController = require('../controllers/userController');
/* Instead of userController = require('...') , we could use destructuring, so the above line would be :
const {<getAllTours, ...>} = require('...'); and in <> we would specify the exact same names for things that we exported in
userController.js . So with this style, we wouldn't need to use userController. ... in order to use the things that we required.
We could use those names directly...*/

const authController = require('../controllers/authController');

/* It's better to call this const variable just router: const userRouter = express.Router(); and then when we are importing or
requiring these routers, we can import them as their unique names in app.js file.But in their routes files, we call them router
instead of their unique name, like userRouter or .... */
const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware:
router.use(authController.protect);

router.patch('/updateMyPassword',authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.getMe, userController.getUser);

// All of the routes after this middleware, should only be callable by the admin:
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

