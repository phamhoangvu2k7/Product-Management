const Cart = require("../../models/carts_model");
const Product = require("../../models/product_model");

// [GET] /cart
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId,
                deleted: false
            }).select("title thumbnail slug price discountPercentage");

            item.productInfo = productInfo;
            item.totalPrice = (item.productInfo.price - parseInt(item.productInfo.price * item.productInfo.discountPercentage / 100)) * item.quantity;
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    const existProductInCart = cart.products.find(
        item => item.product_id == productId
    );

    if (existProductInCart) {
        const quantityNew = quantity + existProductInCart.quantity;

        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        }, {
            $set: {
                "products.$.quantity": quantityNew
            }
        });
    }
    else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };

        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        );
    }


    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
    res.redirect(req.get("referer"));
}

// [GET] /delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: { products: { product_id: productId } }
    });
    res.redirect(req.get("referer"));
}

// [GET] /update/:productId/quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Cart.updateOne(
        {
            _id: cartId,
            "products.product_id": productId
        },
        {
            $set: {
                "products.$.quantity": quantity
            }
        }
    );

    res.redirect(req.get("referer"));
}