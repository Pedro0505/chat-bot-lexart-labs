import joi from 'joi';

const username = joi.string().min(1).max(50).required().messages({
  'string.base': 'Username needs to be a string',
  'string.empty': 'Username cannot be empty',
  'string.min': 'Username must be at least {#limit} characters',
  'string.max': 'Username cannot be more than {#limit} characters',
  'any.required': 'Username is required',
});

const password = joi
  .string()
  .min(8)
  .max(50)
  .custom((value, helper) => {
    if (!/^[^\s]+$/.test(value)) {
      return helper.message({ custom: 'Password cannot contain whitespace' });
    }

    if (!/[a-zA-Z]/.test(value)) {
      return helper.message({ custom: 'Password must contain at least one letter' });
    }

    if (!/[0-9]/.test(value)) {
      return helper.message({ custom: 'Password must contain at least one number' });
    }
  })
  .required()
  .messages({
    'string.base': 'Password needs to be a string',
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least {#limit} characters',
    'string.max': 'Password cannot be more than {#limit} characters',
    'string.pattern.base': 'Password cannot contain whitespace',
    'string.pattern.regex': 'Password must contain at least one number',
    'any.required': 'Password is required',
  });

export { password, username };
