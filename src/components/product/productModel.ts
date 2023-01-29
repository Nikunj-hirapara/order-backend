import mongoose, { ObjectId } from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const Category = new mongoose.Schema({
    name: String,
    discount: Number,
}, { _id: false });

const defaultZero = {
    type: Number,
    default: 0
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    sku: {
        type: String,
        require: false,
        unique: false,
        trim: true,
    }
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_PRODUCT, productSchema);