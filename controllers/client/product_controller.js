const Product = require("../../models/product_model");
const priceProductHelpers = require("../../helpers/priceProduct");

// [GET] /products
module.exports.index = async (req, res) => {
    let products = [];
    products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"})

    const newProducts = priceProductHelpers.priceProduct(products);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            staus: "active"
        };
        const product = await Product.findOne(find);
    
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`/products`)
    }

};