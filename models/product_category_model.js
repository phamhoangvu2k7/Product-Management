const mongoose = require("mongoose");

const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({ 
    title: String,
    parent_id: {
        type: String,
        default: ""
    },
    thumbnail: String,
    description: String,
    status: String,
    position: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
    restoredAt: Date
}, {
    timestamps: true
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "product_category");

module.exports = ProductCategory;