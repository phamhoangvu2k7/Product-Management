const Product = require("../../models/product_model");
const priceProductHelpers = require("../../helpers/priceProduct");


// [GET] /
module.exports.index = async (req, res) => {
    // Get featured product
    let find = {
        featured: "1",
        deleted: false,
        status: "active"
    }
    const productsFeatured = await Product.find(find);
    const newProductsFeatured = priceProductHelpers.priceProduct(productsFeatured);

    // Get new product
    const prodcutdNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"});
    const productsNew = priceProductHelpers.priceProduct(prodcutdNew);

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: productsNew
    });
}