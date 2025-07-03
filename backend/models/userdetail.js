// models/userDetail.js
import mongoose from "mongoose";

const userDetailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,

    },
    fullname: {
        type: String,
        required: true,
        minlength: 4,
    },
    Dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    CitizenshipNumber: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        unique: true,
        maxlength: 10,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    address: {
        province: String,
        district: String,
        municipality: String,
        tole: String,
        ward: Number,
    },
    isapproved:{
        type: Boolean,
        required: true
    }
});

const UserDetail = mongoose.model("UserDetail", userDetailSchema);
export default UserDetail;