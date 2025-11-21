const Product = require("../../models/product_model");
const ProductCategory = require("../../models/product_category_model");

const systemConfig = require("../../config/system");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/Search");
const paginationHelpers = require("../../helpers/pagination");
const createTreeHelpers = require("../../helpers/createTree");

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

    // Sort
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] =  req.query.sortValue;
    }
    else {
        sort.position = "desc";
    }

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success","Cập nhật trạng thái thành công");

    res.redirect(req.get("referer"));
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case "active":
            await Product.updateMany({_id: {$in : ids}}, {status: "active"});
            req.flash("success",`Cập nhật trạng thái của ${ids.length} sản phẩm thành công`);
            break;

        case "inactive":
            await Product.updateMany({_id: {$in : ids}}, {status: "inactive"});
            req.flash("success",`Cập nhật trạng thái của ${ids.length} sản phẩm thành công`);
            break;

        case "delete-all":
            await Product.updateMany({_id: {$in : ids}}, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success",`Xóa ${ids.length} sản phẩm thành công`);
            break;
        case "change-position": 
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position});
            }
            req.flash("success",`Cập nhật vị trí của ${ids.length} sản phẩm thành công`);
            break;
        default:
            break;
    }

    res.redirect(req.get("referer"));
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success",`Xóa sản phẩm thành công`);

    res.redirect(req.get("referer"));
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const category = await ProductCategory.find(find);

    const newCategory = createTreeHelpers.tree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1; 
    }
    else req.body.position = parseInt(req.body.position);
    
    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [POST] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);

        const category = await ProductCategory.find({
            deleted: false
        });

        const newCategory = createTreeHelpers.tree(category);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file)
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    
    try {
        await Product.updateOne({
            _id: req.params.id
        }, req.body);
        req.flash("success", "Cập nhật thành công");
    } catch (error) {
        req.flash("eror", "Cập nhật không thành công");
    }
    res.redirect(req.get("referer"));
}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail", {
            pageTitle: Product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }

}