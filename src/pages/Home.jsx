import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

import axios from "../axios";
import {fetchPosts, fetchTags} from "../redux/slices/posts";
import {useParams} from "react-router-dom";

export const Home = () => {
    const {tag} = useParams()
    const userData = useSelector(state => state.auth.data)
    const dispatch = useDispatch();
    const {posts, tags} = useSelector(state => state.posts)

    const isPostsLoading = posts.status === 'loading'
    const isTagsLoading = tags.status === 'loading'
    const [toggle, setToggle] = useState(0)
    const [comments, setComments] = useState([])
    const [isCommentsLoading , setCommentsLoading] = useState(true)

    useEffect(()=>{
        console.log(tag)
        dispatch(fetchPosts())
        dispatch(fetchTags())
        axios.get(`/comments`)
            .then((res) => {
                res.data.comments ? setComments(res.data.comments) : setComments([])
                setCommentsLoading(false)
            })
            .catch(e => {
                console.warn(e)
                alert("Ошибка при получении комментарий")
            })
    },[])
    const renderPosts = () => {
        if(isPostsLoading){
            return ([...Array(5)].map((obj, index) => <Post key ={index} isLoading={true}/> ))
        }
        if(!!tag){
            const filteredPost = posts.items.slice().filter(({tags})=>tags.includes(tag))
            const postsRender = !!toggle ? filteredPost.sort((a, b) => b.viewsCount - a.viewsCount) : filteredPost
            return (postsRender.map((obj) =>(
                <Post
                    key={obj._id}
                    id={obj._id}
                    title={obj.title}
                    imageUrl={obj.imageUrl && process.env.REACT_APP_API_URL + obj.imageUrl}
                    user={obj.author}
                    createdAt={obj.createdAt}
                    viewsCount={obj.viewsCount}
                    commentsCount={''}
                    tags={obj.tags}
                    isEditable={userData?._id === obj.author._id}
                />)))
        }

        const postsRender = !!toggle ? posts.items.slice().sort((a, b) => b.viewsCount - a.viewsCount) : posts.items
        return (postsRender.map((obj) =>(
            <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl && process.env.REACT_APP_API_URL + obj.imageUrl}
                user={obj.author}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={''}
                tags={obj.tags}
                isEditable={userData?._id === obj.author._id}
            />)))
    }

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={toggle} aria-label="basic tabs example">
        <Tab onClick={()=> setToggle(0)} label="Новые" />
        <Tab onClick={()=> setToggle(1)} label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
            {renderPosts()}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={comments}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
}
