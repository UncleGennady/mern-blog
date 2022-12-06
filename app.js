import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose';
import authRouter from './routes/auth_routes.js'
import postRouter from './routes/post_routes.js'
import uploadRouter from './routes/upload_router.js'
import avatarRouter from './routes/avatar_router.js'
import commentRouter from './routes/comment_router.js'



const PORT = process.env.PORT || 5000

const corsOptions ={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}

const app = express();

app.use(express.json());
app.use(cors(corsOptions))

app.use('/auth', authRouter);

app.use('/uploads', express.static('uploads'));
app.use('/upload', uploadRouter);
app.use('/avatar', avatarRouter);

app.use('/posts', postRouter);

app.use('/comments',commentRouter)




const start = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        app.listen(PORT,(e) =>{
            if(e){
                return console.log(e)
            }
            console.log(`Server started on port ${PORT}`)
        } )

    }catch(e){
        console.log("server error: ", e.message)
        process.exit(1)
    }

}

start()