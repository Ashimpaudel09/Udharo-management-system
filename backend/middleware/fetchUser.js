import jwt from 'jsonwebtoken';
const fetchUser = (req, res, next) => {
    const token = req.header("auth-token")
    if (!token) {
        return res.status(401).json({ error: "Access denied: No token provided" });
    }
    try {
        const secret = process.env.JWT_SECRET; 
        const data = jwt.verify(token, secret)
        req.user = data.user;
        next();
    }
    catch (error) {
        console.error("JWT verification failed:", error.message);
        res.status(401).json({ error: "Access denied: Invalid token" });
    }
}
export default fetchUser;