const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/trash_can_controller");

router.get('/', controller.index);

router.patch('/restore/:id', controller.restoreItem);
router.post('/restore/:id', controller.restoreItem);

module.exports = router;