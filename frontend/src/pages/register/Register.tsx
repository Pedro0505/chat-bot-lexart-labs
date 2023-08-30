import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/input/Input';
import * as userFormSchema from '../../validations/schemas/user/loginForm.validations';
import ErrorCard from '../../components/errorCard/ErrorCard';
import UserDto from '../../dtos/User.dto';
import handleApiErrors from '../../utils/handleApiErrors';
import WebRoutes from '../../constants/WebRoutes';
import register from '../../api/user/register';
import './style.css';

function Register() {
  const [registerForm, setRegister] = useState({ username: '', password: '', confirmPassword: '' });
  const [apiErrors, setApiErrors] = useState('');
  const [registerFormErros, setRegisterErros] = useState({ username: '', password: '', confirmPassword: '' });
  const errorRef = useRef(false);
  const navigate = useNavigate();

  const validateRegisterInfo = (user: UserDto) => {
    const usernameSchema = userFormSchema.username.validate(user.username);
    const passwordSchema = userFormSchema.password.validate(user.password);
    const confirmPasswordSchema = userFormSchema.password.validate(registerForm.confirmPassword);

    const errors = {
      username: usernameSchema.error?.message || '',
      password: passwordSchema.error?.message || '',
      confirmPassword: confirmPasswordSchema.error?.message || '',
    };

    if (usernameSchema.error || passwordSchema.error) {
      errorRef.current = true;
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errorRef.current = true;
      errors.confirmPassword = "Passwords don't match.";
    } else {
      errorRef.current = false;
    }

    setRegisterErros(errors);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const user = new UserDto(registerForm.username, registerForm.password);

    validateRegisterInfo(user);

    if (!errorRef.current) {
      try {
        await register(user);

        navigate(WebRoutes.LOGIN);
        setApiErrors('');
      } catch (error) {
        setApiErrors(handleApiErrors(error));
        console.log(error);
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setRegister(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="register-container">
      <section className="register-section-container">
        <h1>Register</h1>
        <form
          className="register-page-form"
          onSubmit={e => {
            handleSubmit(e);
          }}>
          <Input
            name="username"
            placeholder="Username"
            value={registerForm.username}
            error={registerFormErros.username}
            onChange={handleChange}
          />
          <Input
            name="password"
            placeholder="Password"
            value={registerForm.password}
            error={registerFormErros.password}
            onChange={handleChange}
            type="password"
          />
          <Input
            name="confirmPassword"
            placeholder="Confirm your Password"
            value={registerForm.confirmPassword}
            error={registerFormErros.confirmPassword}
            onChange={handleChange}
            type="password"
          />
          <ErrorCard message={apiErrors} />
          <button className="register-submit-btn" type="submit">
            Register
          </button>
        </form>
      </section>
    </div>
  );
}

export default Register;
