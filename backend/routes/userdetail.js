import { body, validationResult } from 'express-validator';
import fetchUser from '../middleware/fetchUser.js';
import express from 'express'
const router = express.Router()
import userDetail from '../models/userdetail.js'
router.post('/submit/:id', fetchUser, [
    body('fullname', 'please enter a valif name').isLength({ min: 5 }),
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('Dob', 'Date of birth is required').notEmpty(),
    body('gender', 'Gender must be male, female or other').isIn(['male', 'female', 'other']),
    body('Citizenshipnumber', 'Citizenship number is required').notEmpty(),
    body('contactnumber', 'Contact must be 10 digits')
        .isLength({ min: 10, max: 10 })
        .isNumeric(),
], async (res, req) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = req.body
        let isfilled = await userDetail.findOne({ CitizenshipNumber: userDetail.CitizenshipNumber })
        if (isfilled) {
            return res.status(400).json({ message: "KYC is already verified using this citizenship number" })
        }
        const newUser = new userDetail(user)
        newUser.save()
        return res.status(200).json({ message: "KYC Submitted" })
    }

    catch (errors) {
        return res.status(400).json({ message: "KYC verification failed" })
    }

})
export default router;