import React, {useRef, useState} from 'react';
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import axios from "../../axios";



export const Registration = () => {
    const [avatar, setAvatar] = useState('')
    const inputFileRef = useRef(null)
    const isAuth = useSelector(selectIsAuth)
    const dispatch = useDispatch()
    const {register,
        handleSubmit,
        formState:{errors,isValid}
    } = useForm({
        defaultValues:{
            fullName:'',
            email:'',
            password:'',
            avatarUrl: '',
        },
        mode:'onChange'
    })


    const onSubmit = async (values) =>{
        values.avatarUrl = avatar
        const data = await dispatch(fetchRegister(values));
        if(!data.payload){
            return alert('Не удалось зарегистрироваться!')
        }
        if('token' in data.payload){
            window.localStorage.setItem('token', data.payload.token);
        }
    }

    const handleChangeFile = async(event) => {
        try {
            console.log(1)
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const{data} = await axios.post('/avatar', formData);
            console.log(data)
            setAvatar(data.url)

        }catch (err){
            console.warn("ошибка",err);
            alert('Ошибка при загрузке файла!')
        }
    };
    const onClickRemoveImage = async() => {
        try {
            const{data} = await axios.delete('/avatar', {data:{ url: avatar}});
            console.log(data)
            setAvatar('')
        }catch (err){
            console.warn("ошибка",err);
            alert('Ошибка при удалении файла!')
        }
    };

    if(isAuth){
        return <Navigate to='/'/>
    }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
       <div className={styles.avatarButton} >
           {!avatar && <Button onClick={()=> inputFileRef.current.click()} size="large">
               <div className={styles.avatar}>
                   <Avatar sx={{ width: 100, height: 100 }} />
               </div>
           </Button>}
           {!!avatar && <img src={`http://localhost:5000${avatar}`} alt="#"/> }
           <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
           {!!avatar && <Button className={styles.buttonDelete} variant="contained" onClick={onClickRemoveImage}>
               Удалить аватар
           </Button>}
       </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
                error = {!!(errors.fullName?.message)}
                helperText={errors.fullName?.message}
                {...register('fullName', {required:'Укажите имя',
                    minLength: {
                        value: 3,
                        message: 'Некорректное имя'
                    }})}
                className={styles.field} label="Полное имя" fullWidth />
            <TextField
                error = {!!(errors.email?.message)}
                helperText={errors.email?.message}
                {...register('email', {
                    required:'Укажите почту',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Некорректный емаил"
                    }})}
                className={styles.field} label="E-Mail" fullWidth />
            <TextField
                error = {!!(errors.password?.message)}
                helperText={errors.password?.message}
                {...register('password', {required:'Укажите пароль',
                    minLength: {
                        value: 6,
                        message: 'Некорректный пароль'
                    }})}
                className={styles.field} label="Пароль" fullWidth />
          <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
            Зарегистрироваться
          </Button>
        </form>
    </Paper>
  );
};
