const Product = require("../../models/product_model");
const ProductCategory = require("../../models/product_category_model");

const priceProductHelpers = require("../../helpers/priceProduct");
const getSubCategoryHelpers = require("../../helpers/listProductCategory");

// [GET] /products
module.exports.index = async (req, res) => {
    let products = [];
    products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" })

    const newProducts = priceProductHelpers.priceProduct(products);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
    });
};

// [GET] /products/:slugProduct
module.exports.detail = async (req, res) => {
    try {
        const find = {
            slug: req.params.slugProduct,
            deleted: false,
            status: "active"
        };
        
        const product = await Product.findOne(find);

        if (product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });

            product.category = category;
        }

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        console.log(error);
        res.redirect(`/products`)
    }

};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    });

    const listSubCategory = await getSubCategoryHelpers.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = priceProductHelpers.priceProduct(products);

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts
    });
};