const Product = require("../../models/product_model");
const priceProductHelpers = require("../../helpers/priceProduct");


// [GET] /
module.exports.index = async (req, res) => {
    let find = {
        featured: "1",
        deleted: false,
        status: "active"
    }
    const productsFeatured = await Product.find(find);

    const newProducts = priceProductHelpers.priceProduct(productsFeatured);

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProducts
    });
}