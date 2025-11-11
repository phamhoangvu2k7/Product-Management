const Product = require("../../models/product_model");

// [GET] /admin/trash_can/
module.exports.index = async (req, res) => {
    try {
        const products = await Product.find({ 
            deleted: true 
        });

        res.render("admin/pages/trash_can/index", {
            pageTitle: "Danh sách sản phẩm bị xóa",
            products: products
        });
    } catch (error) {
        console.error("Error in trash_can index:", error);
        res.status(500).send("Server Error");
    }
}

// [PATCH] /admin/trash_can/restore/:id
module.exports.restoreItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({_id: id}, {
        deleted: false,
        restoreddAt: new Date()
    });

    req.flash("success",`Khôi phục sản phẩm thành công`);

    res.redirect(req.get("referer"));
}