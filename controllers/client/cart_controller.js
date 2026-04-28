const Cart = require("../../models/carts_model");
const Product = require("../../models/product_model");

// [GET] /cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        user_id: cartId
    });

    if (cart && cart.products.length > 0) {
        for (const item of cart.products) {
            const productInfo = await Product.findOne({
                _id: item.product_id,
                deleted: false
            }).select("title thumbnail slug price discountPercentage");

            if (productInfo) {
                item.productInfo = productInfo;
                item.totalPrice = (productInfo.price - parseInt(productInfo.price * productInfo.discountPercentage / 100)) * item.quantity;
            } else {
                item.productInfo = { title: "Sản phẩm không tồn tại", thumbnail: "", slug: "", price: 0, discountPercentage: 0 };
                item.totalPrice = 0;
            }
        }

        cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart || { products: [], totalPrice: 0 }
    });
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        user_id: cartId
    });

    if (!cart) {
        req.flash("error", "Không tìm thấy giỏ hàng");
        res.redirect(req.get("referer") || "/");
        return;
    }

    const existProductInCart = cart.products.find(
        item => item.product_id == productId
    );

    if (existProductInCart) {
        const quantityNew = quantity + existProductInCart.quantity;

        await Cart.updateOne({
            user_id: cartId,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        });
    }
    else {
        await Cart.updateOne(
            { user_id: cartId },
            { $push: { products: { product_id: productId, quantity: quantity } } }
        );
    }

    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
    res.redirect(req.get("referer") || "/");
}

// [GET] /delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne({
        user_id: cartId
    }, {
        $pull: { products: { product_id: productId } }
    });
    res.redirect(req.get("referer") || "/cart");
}

// [GET] /update/:productId/quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Cart.updateOne(
        {
            user_id: cartId,
            "products.product_id": productId
        },
        {
            $set: {
                "products.$.quantity": quantity
            }
        }
    );

    res.redirect(req.get("referer") || "/cart");
}
