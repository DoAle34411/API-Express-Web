// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControlle');

router.post('/register', userController.createUser); // X
router.get('/cedula/:cedula', userController.findUserByCedula); // X
router.get('/id/:id_user', userController.findUserById); // X
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);
router.post('/login', userController.loginUser); // X
router.post('/update-password/', userController.updatePassword); // X
router.post('/admin/login', userController.loginAdmin); // X
router.get('/admin/allUsers', userController.getAllUsers); // X
router.post('/admin/clear-multa/:user_id', userController.clearMulta); // X


module.exports = router;
