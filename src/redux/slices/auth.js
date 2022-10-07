import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from '../../axios'

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params)=>{
    const {data} = await axios.post("/auth/login", params);
    return data;
})
export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params)=>{
    const {data} = await axios.post("/auth/register", params);
    return data;
})
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async ()=>{
    const {data} = await axios.get("/auth/me");
    return data;
})

const initialState = {
    data: null,
    status: 'loading'
}

const authSlise = createSlice({
    name:'auth',
    initialState,
    reducers: {
        logout : (state) => {state.data = null}
    },
    extraReducers: {
        [fetchAuth.pending]: (state)=>{
            state.ststus = 'loading';
            state.data = null;
        },
        [fetchAuth.fulfilled]: (state, {payload})=>{
            state.ststus = 'loading';
            state.data = payload;
        },
        [fetchAuth.rejected]: (state)=>{
            state.ststus = 'error';
            state.data = null ;
        },
        [fetchAuthMe.pending]: (state)=>{
            state.ststus = 'loading';
            state.data = null;
        },
        [fetchAuthMe.fulfilled]: (state, {payload})=>{
            state.ststus = 'loading';
            state.data = payload;
        },
        [fetchAuthMe.rejected]: (state)=>{
            state.ststus = 'error';
            state.data = null ;
        },
        [fetchRegister.pending]: (state)=>{
            state.ststus = 'loading';
            state.data = null;
        },
        [fetchRegister.fulfilled]: (state, {payload})=>{
            state.ststus = 'loading';
            state.data = payload;
        },
        [fetchRegister.rejected]: (state)=>{
            state.ststus = 'error';
            state.data = null ;
        },
    }})

export const selectIsAuth = state => Boolean(state.auth.data)
export const authReduser = authSlise.reducer;
export const {logout} = authSlise.actions;
