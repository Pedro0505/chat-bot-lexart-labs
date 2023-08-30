import React, { ChangeEvent, useContext, useRef, useState } from 'react';
import Input from '../input/Input';
import UserDto from '../../dtos/User.dto';
import * as loginFormSchema from '../../validations/schemas/user/loginForm.validations';
import login from '../../api/user/login';
import ErrorCard from '../errorCard/ErrorCard';
import handleApiErrors from '../../utils/handleApiErrors';
import './style.css';
import { ChatContext } from '../../context/chatContext/ChatContext';
import { setCookie } from '../../utils/handleCookies';

function LoginForm() {
  const errorRef = useRef(false);
  const { handleSubmitBtnDisable, loginSuccessfully, handleLoginSuccessfully } = useContext(ChatContext);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [apiErrors, setApiErrors] = useState('');
  const [loginFormErros, setLoginFormErros] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const validateLoginInfo = (user: UserDto) => {
    const usernameSchema = loginFormSchema.username.validate(user.username);
    const passwordSchema = loginFormSchema.password.validate(user.password);

    if (usernameSchema.error || passwordSchema.error) {
      errorRef.current = true;

      setLoading(false);
    } else {
      errorRef.current = false;
    }

    setLoginFormErros({
      username: usernameSchema.error?.message || '',
      password: passwordSchema.error?.message || '',
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const user = new UserDto(loginForm.username, loginForm.password);

    validateLoginInfo(user);

    if (!errorRef.current) {
      try {
        const data = await login(user);

        handleSubmitBtnDisable(false);
        handleLoginSuccessfully(true);
        setCookie('chat-user-token', data.token);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setApiErrors(handleApiErrors(error));
        console.log(error);
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setLoginForm(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      {loginSuccessfully ? (
        <div>Login was successful ask me something</div>
      ) : (
        <div className="login-form">
          <p className="login-form-text">To continue please login</p>
          <Input
            name="username"
            placeholder="Username"
            value={loginForm.username}
            error={loginFormErros.username}
            onChange={handleChange}
          />
          <Input
            name="password"
            placeholder="Password"
            value={loginForm.password}
            error={loginFormErros.password}
            onChange={handleChange}
            type="password"
          />
          <ErrorCard message={apiErrors} />
          <div className="login-form-btn-container">
            <button className="login-form-submit-btn" onClick={handleSubmit} disabled={loading}>
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginForm;
