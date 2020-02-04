"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    }
});
const saleSchema = new mongoose.Schema({
    timestamp: {
        type: Date
    },
    revenue: {
        type: Number
    },
    transaction_id: {
        type: String
    },
    store_name: {
        type: String
    },
    products: {
        type: [productSchema],
        default: []
    }
});
exports.Sale = mongoose.model('Sale', saleSchema);
