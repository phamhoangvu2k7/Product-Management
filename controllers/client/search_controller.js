const Product = require("../../models/product_model");
const priceProductHelper = require("../../helpers/priceProduct");

// [GET] /search
module.exports.index = async (req, res) =>  {
    const keyword = req.query.keyword;

    let newProducts = [];
    if (keyword) {
        const regex = new RegExp(keyword, "i");
        const products = await Product.find({
            title: regex,
            deleted: false,
            status: "active"
        });

        newProducts = priceProductHelper.priceProduct(products);
    }

    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    });
}