import React, { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/input/Input';
import login from '../../api/user/login';
import * as loginFormSchema from '../../validations/schemas/user/loginForm.validations';
import ErrorCard from '../../components/errorCard/ErrorCard';
import UserDto from '../../dtos/User.dto';
import { setCookie } from '../../utils/handleCookies';
import handleApiErrors from '../../utils/handleApiErrors';
import WebRoutes from '../../constants/WebRoutes';
import './style.css';
import useDocumentTitle from '../../hook/useDocumentTitle';

function Login() {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [apiErrors, setApiErrors] = useState('');
  const [loginFormErros, setLoginFormErros] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const errorRef = useRef(false);
  const navigate = useNavigate();
  useDocumentTitle('Login');

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const user = new UserDto(loginForm.username, loginForm.password);

    validateLoginInfo(user);

    if (!errorRef.current) {
      try {
        const data = await login(user);

        setCookie('user-session', data.token);
        navigate(WebRoutes.HISTORY);
        setLoading(false);
      } catch (error) {
        setApiErrors(handleApiErrors(error));
        setLoading(false);
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
    <div className="login-container">
      <section className="login-section-container">
        <h1>Login</h1>
        <form
          className="login-page-form"
          onSubmit={e => {
            handleSubmit(e);
          }}>
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
          <p className="login-form-register-message">
            {"Don't"} have an account? <Link to={WebRoutes.REGISTER}>Register</Link>
          </p>
          <button className="login-submit-btn" type="submit" disabled={loading}>
            Login
          </button>
        </form>
      </section>
    </div>
  );
}

export default Login;
