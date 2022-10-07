import React from "react";


import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";



export const Index = (props) => {
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={props.avatar ? `http://localhost:5000${props.avatar}` : '/noavatar.png' }
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={props.text}
            onChange={props.onChangeHandler}
          />
          <Button onClick={props.onSubmitHandler} variant="contained" >Отправить</Button>
        </div>
      </div>
    </>
  );
};
