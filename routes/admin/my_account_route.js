const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/my_account_controller");
const uploadCould = require("../../middlewares/admin/uploadCloud_middlewares");

router.get('/', controller.index);

router.get('/edit', controller.edit);

router.patch(
    '/edit', 
    upload.single("avatar"),
    uploadCould.upload,
    controller.editPatch
);

module.exports = router;