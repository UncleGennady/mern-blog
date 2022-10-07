import fs from "fs";

class UploadController {

    uploadImage = (req, res) => {
        try{
            res.json({
                url:`/uploads/${req.file.originalname}`,
            });
        }catch (e){
            res.status(500).json({message: "Не удалось загрузить картинку"})
        }
    };
    deleteImage = (req, res) => {
        try{
            const url = req.body.url[0] === '/' ?req.body.url.slice(1) : req.body.url;
            fs.unlink(url, (err =>{
                if (err) { 
                    return res.status(404).json({
                        message: "Не удалось найти картинку"
                })
                }else(
                    res.json({
                        success: true
                    })
                )
            } )
            )
            
        }catch(e){
            res.status(500).json({
                message: e.message
            })
        }
    }
}
export default new UploadController()