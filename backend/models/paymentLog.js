// models/paymentLog.js
import mongoose from 'mongoose';

const paymentLogSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    buyerEmail: {
      type: String,
      required: true,
      trim: true
    },
    productName: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true
    },
    pricePerQuantity: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    pendingAmount: {
      type: Number,
      required: true
    },
    paymentDate: {
      type: Date
    }
  },
  { timestamps: true }
);

// ✅ Use PascalCase for models, and export properly
const PaymentLog = mongoose.model('PaymentLog', paymentLogSchema);
export default PaymentLog;
