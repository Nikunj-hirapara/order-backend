import mongoose, { ObjectId } from "mongoose";
import { AppConstants } from "../../utils/appConstants";

const OrderPlacer = new mongoose.Schema({
    name: String,
    DOB: Date,
    phone: String,
}, { _id: false });

const defaultZero = {
    type: Number,
    default: 0
}

const productsSchema = new mongoose.Schema({
    name: String,
    id: String,
    sku: String,
    description: String,
    category: String,
    quantity:defaultZero,
    price: defaultZero,
    discount: defaultZero,
    tax: defaultZero,
    netPrice: defaultZero,
}, { _id: false });

const orderSchema = new mongoose.Schema({
    products: productsSchema,
    shipping:{
        type:String,
        charge:Number,
        estimatedDate:Date
    },
    totalAmount:Number,
    orderStatus:{
        type:String,
        enum:["CREATED","SHIPPED","DELIVERD"]
    },
    onDelivery:{
        signatureRequired:Boolean,
    },
    notify:{
        receiveStausUpdate:Boolean
    },
    customer:OrderPlacer,
    termsAgree:Boolean
}, { timestamps: true });

module.exports = mongoose.model(AppConstants.MODEL_ORDER, orderSchema);