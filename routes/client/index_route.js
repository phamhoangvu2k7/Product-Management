const homeRoutes = require("./home_route");
const productRoutes = require("./product_route");
const categoryMiddleware = require("../../middlewares/client/category_middlewares");

module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use('/', homeRoutes);

    app.use("/products", productRoutes);
}