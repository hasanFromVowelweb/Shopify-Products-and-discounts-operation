import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
    discountID: { type: String, required: true },
    summary: { type: String, required: true },
    perOrderLimit: { type: Number, required: true },
    productPercentageGet: { type: Number, required: true },
    productQuantityGet: { type: Number, required: true },
    productQuantitybuy: { type: Number, required: true },
    selectedResourceBuy: { type: String, required: true },
    selectedResourceGet: { type: String, required: true },
    productVariantIDBuy: { type: String, required: true },
    productVariantIDGet: { type: String, required: true },
    startingDate: { type: String, required: true },
    title: { type: String, required: true },
});

export default mongoose.model('Discount', discountSchema);

