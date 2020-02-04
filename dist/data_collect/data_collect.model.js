"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const dataCollectSchema = new mongoose.Schema({
    event: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
exports.DataCollect = mongoose.model('DataCollect', dataCollectSchema);
