const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/auth_controller")

const validate = require("../../validates/admin/auth_validate");

router.get('/login', controller.login);

router.post(
    '/login', 
    validate.loginPost,
    validate.password,
    controller.loginPost
);

module.exports = router;