import mongoose from "mongoose";

export default function connect_mongo() {
    mongoose.connect('mongodb://localhost:27017/', {
    }).then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
}
