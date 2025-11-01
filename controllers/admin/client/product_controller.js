const Product = require("../../models/product_model");

// [GET] /products
module.exports.index = async (req, res) => {
    let products = [];
    products = await Product.find({
        status: "active",
        deleted: false
    });

    const newProducts = products.map(item => {
        item.priceNew = Math.round(item.price * (100 - item.discountPercentage) / 100);
        return item;
    });

    console.log(products);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
};