const homeRoutes = require("./home_route");
const productRoutes = require("./product_route");
const searchRoutes = require("./search_route");
const cartRoutes = require("./cart_route");

const categoryMiddleware = require("../../middlewares/client/category_middlewares");
const cartMiddleware = require("../../middlewares/client/cart_middlewares");

module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);

    app.use('/', homeRoutes);

    app.use("/products", productRoutes);
    
    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);
}