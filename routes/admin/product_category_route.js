const express = require('express');

const multer = require('multer');

const router = express.Router();

const upload = multer();


const controller = require("../../controllers/admin/product_category_controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud_middlewares");

const validate = require("../../validates/admin/product_category_validate");

router.get('/', controller.index);

router.get('/create', controller.create);

router.get('/edit/:id', controller.edit);

router.get('/detail/:id', controller.detail);

router.patch(
    '/edit/:id', 
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);

router.post(
    '/create',
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

module.exports = router;