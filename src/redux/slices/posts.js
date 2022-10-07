import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ()=>{
    const {data} = await axios.get("/posts");
    return data.posts.reverse();
})
export const fetchRemovePosts = createAsyncThunk('posts/fetchRemovePost', async (id)=>{
    await axios.delete(`/posts/${id}`);
})
export const fetchTags = createAsyncThunk('posts/fetchTags', async ()=>{
    const {data} = await axios.get("/posts/tags");
    return data.tags;
})

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    },
}

const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers:{},
    extraReducers:{
        //Получение статей
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, {payload}) => {
            state.posts.items = payload;
            state.posts.status = "loaded";
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
        //Получение тегов
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, {payload}) => {
            state.tags.items = payload;
            state.tags.status = "loaded";
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },
        //Удаление статей
        [fetchRemovePosts.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
        },
    }
})

export const postsReducer = postsSlice.reducer