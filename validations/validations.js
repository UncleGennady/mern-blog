import { body } from 'express-validator'
export const registerValidation = [
    body('email', 'Неверный формат почты',).isEmail(),
    body('password', 'Длина пароля должна быть больше 5 символов').isLength({min:6}),
    body('fullName','Укажите имя').isLength({min:3}),
    body('avatarUrl','Неверная ссылка на аватарку').optional().isString(),
];

export const loginValidation = [
    body('email', 'Неверный формат почты',).isEmail(),
    body('password', 'Длина пароля должна быть больше 5 символов').exists(),
];

export  const postCreateValidation = [
    body('title', "Введите корректный заголовок").isLength({min:1}).isString(),
    body('text', "Введите корректный текст статьи ").isLength({min:5}).isString(),
    body('tags', "Неверный формат тэгов").optional().isArray(),
    body('imageUrl', "Некорректная ссылка изображения").optional().isString(),
];

export  const commentCreateValidation = [
    body('text', "Введите корректный коментарий ").isLength({min:1}).isString(),
];