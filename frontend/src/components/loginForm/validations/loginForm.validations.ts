import joi from 'joi';

const username = joi.string().min(1).max(50).required().messages({
  'string.base': 'O nome de usuário precisa ser uma string',
  'string.empty': 'O nome de usuário não pode ser vazio',
  'string.min': 'O nome de usuário precisa ter pelo menos {#limit} caracteres',
  'string.max': 'O nome de usuário não pode ter mais que {#limit} caracteres',
  'any.required': 'O nome de usuário é obrigatório',
});

const password = joi
  .string()
  .min(1)
  .max(50)
  .pattern(/^[^\s]+$/)
  .regex(/[0-9]/)
  .regex(/[a-zA-Z]/)
  .required()
  .messages({
    'string.base': 'A senha precisa ser uma string',
    'string.empty': 'A senha não pode ser vazia',
    'string.min': 'A senha precisa ter pelo menos {#limit} caracteres',
    'string.max': 'A senha não pode ter mais que {#limit} caracteres',
    'string.pattern.base': 'A senha não pode conter espaços em branco',
    'string.pattern.regex': 'A senha tem que conter pelo menos um número',
    'any.required': 'A senha é obrigatória',
  });

export { password, username };
