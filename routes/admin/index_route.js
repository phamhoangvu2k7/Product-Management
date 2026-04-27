const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard_route");
const productRoutes = require("./product_route");
const trashCanRoutes = require("./trash_can_route");
const productCategoryRoutes = require("./product_category_route");
const roleRouters = require("./role_route");
const accountRouters = require("./account_route");
const authRouters = require("./auth_route");
const myAccountRouters = require("./my_account_route");
const settingRouters = require("./setting_route");

const authMiddleware = require("../../middlewares/admin/auth_middlewares")

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(
        PATH_ADMIN + "/dashboard", 
        authMiddleware.requireAuth, 
        dashboardRoutes
    );

    app.use(
        PATH_ADMIN + "/products", 
        authMiddleware.requireAuth, 
        productRoutes
    );

    app.use(
        PATH_ADMIN + "/trash_can", 
        authMiddleware.requireAuth, 
        trashCanRoutes
    );

    app.use(
        PATH_ADMIN + "/product_category", 
        authMiddleware.requireAuth, 
        productCategoryRoutes
    );

    app.use(
        PATH_ADMIN + "/role",
        authMiddleware.requireAuth, 
        roleRouters
    );

    app.use(
        PATH_ADMIN + "/account", 
        authMiddleware.requireAuth, 
        accountRouters
    );

    app.use(
        PATH_ADMIN + "/my_account",
        authMiddleware.requireAuth, 
        myAccountRouters
    );

    app.use(PATH_ADMIN + "/auth", authRouters);

    app.use(
        PATH_ADMIN + "/setting",
        authMiddleware.requireAuth, 
        settingRouters
    );
}