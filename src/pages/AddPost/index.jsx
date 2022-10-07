import React, {useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';

import {selectIsAuth} from "../../redux/slices/auth";
import axios from "../../axios"


export const AddPost = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const inputFileRef = useRef(null)
  const isAuth = useSelector(selectIsAuth)
  const [imageUrl, setImageUrl] = useState('')
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [isLoading, setLoading] = useState('loading')
  const isEditing  = !!(id)

useEffect(()=>{
    if(id){
        axios.get(`/posts/${id}`).then(({data})=>{
            setTitle(data.doc.title)
            setTags(data.doc.tags.join(' '))
            setText(data.doc.text)
            setImageUrl(data.doc.imageUrl)
        }).catch(e=>{
            console.warn(e);
            alert('Ошибка при получении статьи')
        })
    }
},[])

  const handleChangeFile = async(event) => {
      try {
          const formData = new FormData();
          const file = event.target.files[0];
          formData.append('image', file);
          const{data} = await axios.post('/upload', formData);
          console.log(data)
          setImageUrl(data.url)
      }catch (err){
          console.warn("ошибка",err);
          alert('Ошибка при загрузке файла!')
      }
  };

  const onClickRemoveImage = async() => {
      try {
          const{data} = await axios.delete('/upload', {data:{ url: imageUrl}});
          console.log(data)
          setImageUrl('')

      }catch (err){
          console.warn("ошибка",err);
          alert('Ошибка при удалении файла!')
      }
  };

    const onSubmit = async() =>{
        try{
            setLoading('loading')

            const fields = {
                title,
                imageUrl,
                text,
                tags: tags.split(' '),

            };

            const {data} = isEditing ? await axios.patch(`/posts/${id}`, fields) : await axios.post('/posts/', fields);

            const idPost = isEditing ? id : data.post._id
            navigate(`/posts/${idPost}`);
        }catch (e) {
            console.warn(e)
            alert('Ошибка при создании статьи!')
        }
    }

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!isAuth){
      return <Navigate to='/' />
  }
  return (
    <Paper style={{ padding: 30 }}>
      <Button className={styles.buttons} onClick={()=> inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
          <>
            <Button className={[styles.buttons, styles.buttonDelete]} variant="contained" color="error" onClick={onClickRemoveImage}>
              Удалить
            </Button>
          {imageUrl && (
              <img className={styles.image} src={process.env.REACT_APP_API_URL + imageUrl} alt="Uploaded" />
              )}
          </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}

        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField classes={{ root: styles.tags }} variant="standard" value={tags} onChange={(e)=>setTags(e.target.value)} placeholder="Тэги" fullWidth />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
            {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button onClick={ imageUrl !== '' && onClickRemoveImage} size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
