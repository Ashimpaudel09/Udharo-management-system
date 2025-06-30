import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import dotenv from 'dotenv';
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET
dotenv.config()
//Signup
router.post('/signup',
    [
        body('name', 'please enter a valid name').isLength(2),
        body('email', 'Please enter a valid email').isEmail(),
        body('password', 'Password must be atleast 6 character').isLength(6)
    ],
    async (res, req) => {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const { name, email, password, type } = req.body;
            let user = await User.findOne({ email })
            if (user) {
                return res.status(400).json({ error: 'User already exists' });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = await new User({
                name,
                email,
                password: hashedPassword,
                type
            });
            await user.save()

            const payload = {
                user: {
                    id: user.id,
                    type: user.type
                }
            }
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
            res.status(201).json({ token, userId: user.id, user_token: token });

        }
        catch (err) {
            console.log(err.message)
            res.status(500).send('server error')
        }

    })



//Login
router.post('/login', [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password must be atleast 6 character').isLength(6)
],

    async (res, req) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }
            const { email, password, type } = req.body
            let user = await User.findOne({ email, type })
            if (!user) {
                return res.status(400).json({ error: 'User doesnot exists' });
            }
            const isUser = await bcrypt.compare(password, user.password)
            if (!isUser) {
                return res.status(401).json({ error: "Incorrect password" })
            }
            const payload = {
                user: {
                    id: user.id,
                    type: user.type
                }
            }
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
            res.json({ token, userId: user.id });

        }
        catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
)

export default Router;