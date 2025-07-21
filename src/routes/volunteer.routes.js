const express = require('express');
const router = express.Router();
const { registerVolunteer, loginVolunteer } = require('../controllers/volunteer.controller');

router.post('/register', registerVolunteer);
router.post('/login', loginVolunteer);

module.exports = router;