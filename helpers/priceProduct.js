module.exports.priceProduct = (productsFeatured) => {
    const newProducts = productsFeatured.map(item => {
        item.priceNew = Math.round(item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    });

    return newProducts;
}