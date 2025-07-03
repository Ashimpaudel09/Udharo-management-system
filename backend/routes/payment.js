import express from 'express';
import fetchUser from '../middleware/fetchUser.js';
import PaymentLog from '../models/paymentLog.js';
import User from '../models/user.js'
const router = express.Router()
router.post('/createPaymentLog', fetchUser, async (req, res) => {
    try {
        const {
            buyerEmail,
            productName, quantity, pricePerQuantity,
            totalPrice, pendingAmount, paymentDate
        } = req.body
        const buyerUser = await User.findOne({ email: buyerEmail });
        if (!buyerUser) {
            return res.status(404).json({ error: 'Buyer not found' });
        } 
       
        const newLog = new PaymentLog({
            seller: req.user.id,
            buyer: buyerUser._id,
            buyerEmail,
            productName,
            quantity,
            pricePerQuantity,
            totalPrice,
            pendingAmount,
            paymentDate
        });

        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    }
    catch (errors) {
        res.status(400).json({ errrors: errors })
    }
})

router.get('/getpaymentlogs', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    if (userType === 'buyer') {
      // Fetch all payments made by the buyer
      const buyerLogs = await PaymentLog.find({ buyer: userId })
        .populate('seller', 'name email') // Optional: customize what you populate
        .sort({ createdAt: -1 });

      return res.status(200).json({
        role: 'buyer',
        payments: buyerLogs
      });

    } else if (userType === 'seller') {
      // Fetch all payments made to the seller
      const sellerLogs = await PaymentLog.find({ seller: userId })
        .populate('buyer', 'name email')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        role: 'seller',
        payments: sellerLogs
      });

    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
});

export default router;