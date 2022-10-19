import CommentModel from "../model/Comment.js";



class CommentController {

    getCommentsPost = async (req, res) => {
        try {
            const postId = req.params.id
            const comments = await CommentModel.find({postId}).populate('author').exec();
            if(!comments.length){
                return res.json({message: "Нет комментарий"})
            }
            res.json({success: true, comments})

        }catch(e){
            console.log(e)
            return res.status(500).json({message: 'Что-то пошло не так '})
        }
    }
    
    getLastComments = async (req, res) =>{
        try {
            const commentsFull = await CommentModel.find().populate('author').exec();
            const comments =commentsFull.reverse().slice(0,7);
        
            if(!comments){
                return res.json({message: "Нет коментариев"})
            }
            res.json({success: true, comments})

        }catch (e){
            console.log(e)
            return res.status(500).json({message:"Не удалось получить комментарии"})
        }
    }

    create = async (req, res) => {
        try {
            const doc = new CommentModel({
                text: req.body.text,
                author: req.userId,
                postId: req.postId,
            })
            const comment = await doc.save()
            res.json({success: true, comment})

        }catch(e){
            console.log(e)
            return res.status(500).json({message: 'Что-то пошло не так '})
        }
    };

    delete = (req, res) =>{
        try {
            const commentId = req.params.id;
            console.log(commentId)
            CommentModel.findByIdAndDelete(
                {
                    _id:commentId
                },
                (err, doc) =>{
                    if(err){
                        {
                            console.log(err)
                            return res.status(500).json({message:"Не удалось удалить комментарий"})
                        }
                    }
                    if(!doc){
                        return res.status(404).json({message:"комментарий не найден"})
                    }

                    res.json({success: true})
                }
            )

        }catch (e){
            console.log(e)
            return res.status(500).json({message:"Не удалось получить комментарий"})
        }
    };

    deletePostComments = async(id) =>{
        try{
           await CommentModel.deleteMany({postId: id})
            return({
                success: true
            })
        }catch (e){
            return({
                success: false,
                error: e
            })
        }
    };


}

export default new CommentController()