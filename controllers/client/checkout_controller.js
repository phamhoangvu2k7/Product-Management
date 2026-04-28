const Cart = require("../../models/carts_model");
const Product = require("../../models/product_model");
const Order = require("../../models/orders_model");

// [GET] /checkout/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        user_id: cartId
    });

    if (!cart || cart.products.length === 0) {
        req.flash("error", "Giỏ hàng trống");
        res.redirect("/cart");
        return;
    }

    for (const item of cart.products) {
        const productInfo = await Product.findOne({
            _id: item.product_id,
            deleted: false
        }).select("title thumbnail slug price discountPercentage");

        if (productInfo) {
            item.productInfo = productInfo;
            item.productInfo.priceNew = productInfo.price - parseInt(productInfo.price * productInfo.discountPercentage / 100);
            item.totalPrice = item.productInfo.priceNew * item.quantity;
        } else {
            item.productInfo = { title: "Sản phẩm không tồn tại", thumbnail: "", slug: "", price: 0, discountPercentage: 0, priceNew: 0 };
            item.totalPrice = 0;
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    });
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    const cart = await Cart.findOne({
        user_id: cartId
    });

    if (!cart || cart.products.length === 0) {
        req.flash("error", "Giỏ hàng trống");
        res.redirect("/cart");
        return;
    }

    const products = [];

    for (let product of cart.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("price discountPercentage");

        if (productInfo) {
            products.push({
                product_id: product.product_id,
                price: productInfo.price,
                discountPercentage: productInfo.discountPercentage,
                quantity: product.quantity
            });
        }
    }

    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    };

    const order = new Order(orderInfo);
    await order.save();

    await Cart.updateOne({
        user_id: cartId
    }, {
        products: []
    });

    res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.orderId
    });

    if (!order) {
        res.redirect("/");
        return;
    }

    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail");

        product.priceNew = (product.price - parseInt(product.price * product.discountPercentage / 100));
        product.totalPrice = product.priceNew * product.quantity;
        product.productInfo = productInfo || { title: "Sản phẩm không tồn tại", thumbnail: "" };
    }

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        order: order
    });
}
