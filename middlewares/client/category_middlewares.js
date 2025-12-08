const ProductCategory = require("../../models/product_category_model");
const createTreeHelpers = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
    let find = {
        deleted: false
    };
    
    const  productCategory = await ProductCategory.find(find);
    const newproductCategory = createTreeHelpers.tree(productCategory);

    res.locals.layoutProductsCategory = newproductCategory;

    next();
}