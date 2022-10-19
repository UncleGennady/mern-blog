import PostModel from "../model/Post.js";
import commentController from "./comment_controller.js";


class PostController{

    create = async (req, res) => {
        try {
            const doc = new PostModel({
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                author: req.userId
            })

            const post = await doc.save()
            res.json({success: true, post})

        }catch(e){
            console.log(e)
            return res.status(500).json({message: 'Что-то пошло не так '})
        }
    }

    getAll = async (req, res) =>{
        try {
            const posts = await PostModel.find().populate('author').exec();
            if(!posts.length){
                return res.status(404).json({message: "Нет постов"})
            }
            res.json({success: true, posts})

        }catch (e){
            console.log(e)
            return res.status(500).json({message:"Не удалось получить статьи"})
        }
    }

    getLastTags = async (req, res) =>{
        try {
            const posts = await PostModel.find().exec();
            const tags = posts.map(obj => obj.tags).flat().reverse().slice(0,20);

            if(!tags){
                return res.status(404).json({message: "Нет тегов"})
            }
            res.json({success: true, tags})

        }catch (e){
            console.log(e)
            return res.status(500).json({message:"Не удалось получить статьи"})
        }
    }

    get =  (req, res) =>{
        try {
            const postId = req.params.id;

             PostModel.findByIdAndUpdate(
                {
                _id:postId
                },
                {
                $inc: {viewsCount: 1}
                },
                {
                    returnDocument: "after"
                },
                (err, doc) =>{
                    if(err){
                        {
                            console.log(err)
                            return res.status(500).json({message:"Не удалось получить статью"})
                        }
                    }
                    if(!doc){
                        return res.status(404).json({message:"Статья не найдена"})
                    }

                    res.json({success: true, doc})
                }
            ).populate('author')
             
        }catch (e){
            console.log(e)
            return res.status(500).json({message:"Не удалось получить статью"})
        }
    }

    delete = (req, res) =>{
        try {
            const postId = req.params.id;
            console.log(postId)
            PostModel.findByIdAndDelete(
                {
                    _id:postId
                },
                (err, doc) =>{
                    if(err){
                        {
                            console.log(err)
                            return res.status(500).json({message:"Не удалось удалить статью"})
                        }
                    }
                    if(!doc){
                        return res.status(404).json({message:"Статья не найдена"})
                    }
                    commentController.deletePostComments(postId)
                        .then(response =>{
                            if(!response.success){
                                console.log(response.error)
                                return res.status(500).json({message:"Не удалось удалить комментарии статьи"})
                            }
                        })
                    res.json({success: true})
                }
            )

        }catch (e){
            console.log(e)
            return res.status(500).json({message:"Не удалось получить статью"})
        }
    }

    update = async (req, res) =>{
        try {
            const postId = req.params.id;
            await PostModel.updateOne(
                {_id: postId},{
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                }
            );

            res.json({success: true})

        }catch (e){
            console.log(e)
            return res.status(500).json({message:"Не удалось обновить статью"})
        }
    }
}

export default new PostController()