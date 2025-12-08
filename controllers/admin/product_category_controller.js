const ProductCategory = require("../../models/product_category_model");
const systemConfig = require("../../config/system");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/Search");
const paginationHelpers = require("../../helpers/pagination");
const createTreeHelpers = require("../../helpers/createTree");

// [GET] /admin/product_category
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
    const countProducts = await ProductCategory.countDocuments(find);

    let objectPagination = paginationHelpers({
        currentPage: 1
    }, req.query, countProducts);

    const records = await ProductCategory.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    const newRecords = createTreeHelpers.tree(records);

    res.render("admin/pages/product_category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [GET] /admin/product_category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelpers.tree(records);

    res.render("admin/pages/product_category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
}

// [POST] /admin/product_category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    }
    else req.body.position = parseInt(req.body.position);

    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", `Tạo danh mục sản phẩm thành công`);

    res.redirect(`${systemConfig.prefixAdmin}/product_category`);
}

// [GET] /admin/product_category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });

        const records = await ProductCategory.find({
            deleted: false
        });

        const newRecords = createTreeHelpers.tree(records);

        res.render("admin/pages/product_category/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product_category`);
    }
}

// [PATCH] /admin/product_category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({_id: id}, req.body);

    req.flash("success", "Cập nhật thành công");
    
    res.redirect(`${systemConfig.prefixAdmin}/product_category`);
}

module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });

        res.render("admin/pages/product_category/detail", {
            pageTitle: "Chi tiết danh mục sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product_category`);
    }
    
}

module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật trạng thái thành công");

    res.redirect(req.get("referer"));
}

// [PATCH] /admin/product_category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case "active":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`);
            break;

        case "inactive":
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Cập nhật trạng thái của ${ids.length} sản phẩm thành công`);
            break;

        case "delete-all":
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Xóa ${ids.length} sản phẩm thành công`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await ProductCategory.updateOne({ _id: id }, { position: position });
            }
            req.flash("success", `Cập nhật vị trí của ${ids.length} sản phẩm thành công`);
            break;
        default:
            break;
    }

    res.redirect(req.get("referer"));
}

// [DELETE] /admin/product_category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    await ProductCategory.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Xóa danh mục sản phẩm thành công`);

    res.redirect(req.get("referer"));
}