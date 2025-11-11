const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard_route");
const productRoutes = require("./product_route");
const trashCanRoutes = require("./trash_can_route");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
    app.use(PATH_ADMIN + "/products", productRoutes);
    app.use(PATH_ADMIN + "/trash_can", trashCanRoutes);
}