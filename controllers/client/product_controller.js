const Product = require("../../models/product_model");

// [GET] /products
module.exports.index = async (req, res) => {
    let products = [];
    products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"})

    const newProducts = products.map(item => {
        item.priceNew = Math.round(item.price * (100 - item.discountPercentage) / 100);
        return item;
    });

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