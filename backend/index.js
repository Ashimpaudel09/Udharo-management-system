import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import userDetail from './routes/userdetail.js';
import payment from './routes/payment.js'
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000
connectDB()
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/userdetails', userDetail);
app.use('/api/payment', payment);

app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});