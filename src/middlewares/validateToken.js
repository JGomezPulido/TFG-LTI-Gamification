import jwt from "jsonwebtoken"
export const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    if(!token) return res.status(401).json({message: "Auth denied"});
    jwt.verify(token, process.env.TK_SECRET, (error, decoded) => {
        if(error) return  res.status(403).json({message: "Auth denied"});
        req.user = decoded;
        next();
    });    
}