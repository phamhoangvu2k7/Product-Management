const Cart = require("../../models/carts_model");

module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        cart.user_id = cart.id;
        await cart.save();

        const expiresCookie = 365 * 24 * 60 * 60 * 1000;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie)
        });

        res.locals.miniCart = { totalQuantity: 0 };
    }
    else {
        const cart = await Cart.findOne({
            user_id: req.cookies.cartId
        });

        if (cart) {
            cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
            res.locals.miniCart = cart;
        }
        else {
            const newCart = new Cart();
            await newCart.save();
            newCart.user_id = newCart.id;
            await newCart.save();

            const expiresCookie = 365 * 24 * 60 * 60 * 1000;
            res.cookie("cartId", newCart.id, {
                expires: new Date(Date.now() + expiresCookie)
            });

            res.locals.miniCart = { totalQuantity: 0 };
        }
    }

    next();
}
