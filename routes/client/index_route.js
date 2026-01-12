const homeRoutes = require("./home_route");
const productRoutes = require("./product_route");
const searchRoutes = require("./search_route");
const cartRoutes = require("./cart_route");
const checkoutRouters = require("./checkout_route");
const userRouters = require("./user_route");

const categoryMiddleware = require("../../middlewares/client/category_middlewares");
const cartMiddleware = require("../../middlewares/client/cart_middlewares");
const userMiddleware = require("../../middlewares/client/user_middlewares");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUser);

    app.use('/', homeRoutes);

    app.use("/products", productRoutes);
    
    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);

    app.use("/checkout", checkoutRouters);

    app.use("/user", userRouters);
}