import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'
dotenv.config()

export default (req, res, next) =>{
    try{
        const token = (req.headers.authorization || ' ').replace(/Bearer\s?/,'');
        if(!token.trim()){
            return res.status(403).json({message:"Нет доступа!"})
        }
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        req.userId = decoded._id
    }
    catch(e){
        return res.status(403).json({message:"Нет доступа!"})
    }

    next();
}