const express = require('express');
const router = express.Router();

// IMPORT CONTROLLERS
const APIController = require('../controllers/APIController');

// IMPORT MIDDLEWARES
const AuthMiddleware = require('../middlewares/authMiddleware')
const CheckIPAndUserAgent = require('../middlewares/checkIPAndUserAgent')

router.get('/check-auth',AuthMiddleware.authenticate('jwt', { session: false }),CheckIPAndUserAgent(),APIController.checkAuth); 
router.post('/authenticate', APIController.authenticate);
router.post('/signup',APIController.signup);
router.put('/change-user-password',AuthMiddleware.authenticate('jwt', { session: false }),CheckIPAndUserAgent(),APIController.changePassword);

router.get('/tasks',AuthMiddleware.authenticate('jwt', { session: false }),CheckIPAndUserAgent(),APIController.getTasks)
router.post('/tasks',AuthMiddleware.authenticate('jwt', { session: false }),CheckIPAndUserAgent(),APIController.addTask);
router.put('/tasks',AuthMiddleware.authenticate('jwt', { session: false }),CheckIPAndUserAgent(),APIController.updateTask);
router.delete('/tasks',AuthMiddleware.authenticate('jwt', { session: false }),CheckIPAndUserAgent(),APIController.deleteTask);


module.exports = router;