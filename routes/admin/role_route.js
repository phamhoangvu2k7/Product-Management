const express = require('express');

const multer = require('multer');

const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/role_controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud_middlewares");

const validate = require("../../validates/admin/product_category_validate");

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', controller.createPost);

router.get('/detail/:id', controller.detail);

router.get('/edit/:id', controller.edit);

router.patch(
    '/edit/:id',
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
)

router.delete('/delete/:id', controller.deletePermission);

router.patch('/change-multi', controller.changeMulti);

router.get('/permission', controller.permission);

router.patch('/permission', controller.permissionPatch);

module.exports = router;