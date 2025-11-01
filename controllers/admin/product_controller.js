const Product = require("../../models/product_model");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/Search");
const paginationHelpers = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    // Bộ lọc 
    const filterStatus = filterStatusHelpers(req.query);

    let find = {
        deleted: false
    };

    if (req.query.status)
        find.status = req.query.status;

    // Search
    const objectSearch = searchHelpers(req.query); 

    if (objectSearch.keyword) {
        find.title = objectSearch.regex;
    }

    // Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelpers({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts);

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}