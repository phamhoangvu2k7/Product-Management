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
    const newProductsFeatured = priceProductHelpers.priceProduct(productsFeatured);

    const prodcutdNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"});
    const productsNew = priceProductHelpers.priceProduct(prodcutdNew);

    res.render("client/pages/home/index", {
        pageTitle: "Home",
        pageDescription: "PM Store - Buy genuine laptops, smartphones, tablets at the best prices. Fast nationwide delivery, 12-month warranty.",
        currentPath: "/",
        ogType: "website",
        productsFeatured: newProductsFeatured,
        productsNew: productsNew
    });
}
