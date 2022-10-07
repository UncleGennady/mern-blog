import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../model/User.js";

class AuthController {

    login = async (req, res)=>{
        try{
            const user = await UserModel.findOne({email: req.body.email});
            if(!user){
                return res.status(404).json({message: "Неверный логин или пароль"})
            }
            const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
            if(!isValidPass){
                return res.status(404).json({message: "Неверный логин или пароль"})
            }

            const token = jwt.sign(
                {
                    _id: user._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '24h'
                },
            );

            res.json({success: true, ...user._doc, token})
        }
        catch(e){
            res.status(500).json({
                message:"Не удалось авторизоваться",
            });
        }

    };

    register = async (req, res)=>{
        try{
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(req.body.password, salt)

            const doc = new UserModel({
                fullName: req.body.fullName,
                email: req.body.email,
                passwordHash,
                avatarUrl: req.body.avatarUrl
            })
            const user = await doc.save();

            const token = jwt.sign(
                {
                    _id: user._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '24h'
                },
            );

            res.json({success: true, ...user._doc, token})
        }
        catch(e){
            res.status(500).json({
                message:"Не удалось зарегистрироваться",
            });
        }

    };

    getMe = async (req, res) =>{
        try{
            const user = await UserModel.findById(req.userId)
            if(!user){
                return res.status(404).json({message: "Пользователь не найден"})
            }


            res.json({success: true, ...user._doc})
        }catch(e){
            res.status(500).json({message:'Что-то пошло не так'})
        }
    }
}

export default new AuthController