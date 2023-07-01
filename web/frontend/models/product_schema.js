import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    src: { type: String, required: true },
    title: { type: String, required: true },
    handle: { type: String, required: true },
    status: { type: String, required: true },
    price: { type: Number, required: true },
});

export default mongoose.model('Product', productSchema);

