// routes/routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/adduser', userController.addUser);
router.get('/getUsers', userController.getUsers);
router.get('/searchUser/:id', userController.searchUser);
router.post('/deleteUser/:id', userController.deleteUser);
router.post('/editUser', userController.editUser);

module.exports = router;
