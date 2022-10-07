import PostModel from "../model/Post.js";

export default async (req, res, next) =>{
    try{
        const id = req.body.id
        if(!id){
            return res.status(403).json({message: "Нет id поста"})
        }
        const check = await PostModel.findById(id);
        if(!check){
            return res.status(500).json({message: "Такого поста нет"})
        }
        req.postId = id;
    }
    catch(e){
        res.status(403).json({message:"Нет поста!"})
    }

    next();
}