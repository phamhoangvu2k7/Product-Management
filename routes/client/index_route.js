const homeRoutes = require("./home_route");
const productRoutes = require("./product_route");
const searchRoutes = require("./search_route");
const cartRoutes = require("./cart_route");
const checkoutRouters = require("./checkout_route");
const userRouters = require("./user_route");
const chatRouters = require("./chat_route");

const categoryMiddleware = require("../../middlewares/client/category_middlewares");
const cartMiddleware = require("../../middlewares/client/cart_middlewares");
const userMiddleware = require("../../middlewares/client/user_middlewares");
const settingMiddleware = require("../../middlewares/client/setting_middlewares");
const authMiddleware = require("../../middlewares/client/auth_middlewares");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);
    app.use(settingMiddleware.SettingGeneral);

    app.use('/', homeRoutes);

    app.use("/products", productRoutes);
    
    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);

    app.use("/checkout", checkoutRouters);

    app.use("/user", userRouters);

    app.use("/chat", authMiddleware.requireAuth, chatRouters);
}