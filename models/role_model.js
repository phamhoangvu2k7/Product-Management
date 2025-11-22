const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({ 
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
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

const Role = mongoose.model('Role', roleSchema, "role");

module.exports = Role;