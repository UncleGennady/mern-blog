import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from '../axios'
import {useSelector} from "react-redux";



export const FullPost = () => {
    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.data)
    const {id} = useParams();
    const [data, setData] = useState()
    const [isLoading, setLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')
    const getComments = () => axios.get(`/comments/${id}`)
        .then((res) => {
            res.data.comments ? setComments(res.data.comments) : setComments([])
        })
        .catch(e => {
            console.warn(e)
            alert("Ошибка при получении комментарий")
        })

    const onCommentSubmit = async() =>{
        try{
            !!(commentText.trim()) && await axios.post('/comments', { text:commentText, id});
            setCommentText('');
            getComments()

        }catch(e){
            console.log(e.response)
            alert('Ошибка при отправке комментария')
            if(e.response.status === 403 && window.confirm("Хотите войти ?")) navigate('/login')
        }

    }
    useEffect(()=>{
        axios.get(`/posts/${id}`)
            .then((res) => {
                setData(res.data.doc)
                console.log(res.data.doc)
                setLoading(false)
            })
            .catch(e => {
                console.warn(e)
                alert("Ошибка при получении статьи")
            })

        getComments()
    },[])

    if(isLoading){
        return <Post isLoading={isLoading}/>
    }
  return (
    <>
      <Post
          id={data._id}
          title={data.title}
          imageUrl={data.imageUrl && `http://localhost:5000${data.imageUrl}`}
          user={data.author}
          createdAt={data.createdAt}
          viewsCount={data.viewsCount}
          commentsCount={comments.length}
          tags={data.tags}
          isEditable ={userData?._id === data.author._id}
      >
        <ReactMarkdown children={data.text}/>
      </Post>
      <CommentsBlock
        items={comments}
        isLoading={isLoading}
      >
        <Index text={commentText} avatar={userData?.avatarUrl} onSubmitHandler={onCommentSubmit} onChangeHandler={(e)=>{
            setCommentText(e.target.value)
            console.log(commentText)
        }} />
      </CommentsBlock>
    </>
  );
};
