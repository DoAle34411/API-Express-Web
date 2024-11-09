// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControlle');

router.post('/register', userController.createUser);
router.get('/cedula/:cedula', userController.findUserByCedula);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);
router.post('/login', userController.loginUser);
router.post('/update-password/:id', userController.updatePassword);
router.post('/admin/login', userController.loginAdmin);
router.get('/admin/allUsers', userController.getAllUsers);

module.exports = router;
