import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../hooks/useForm.js';

function Register({ handleRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /*   const { values, handleChange, setValues } = useForm({});
    console.log(values)
    useForm({ email, password }); 
   handleChange(e.target.value);*/

  function handleInputEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleInputPasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleRegister(email, password);
  }

  return (
    <form className="login__form" autoComplete="off" onSubmit={handleSubmit}>
      <h2 className="login__header">Регистрация</h2>
      <input value={email} onChange={handleInputEmailChange} id="email" type="email" className="login__input" name="email"
        placeholder="Email" minLength="5" maxLength="30" required />
      <span className="login__text-error login-email-error"></span>
      <input value={password} onChange={handleInputPasswordChange} id="password" type="password" className="login__input " name="password"
        placeholder="Пароль" minLength="8" maxLength="20" required />
      <span className="login__text-error login-password-error"></span>
      <button type="submit" className="login__button-submit">Зарегистрироваться</button>
      <Link className="login__link-auth" to='/sign-in'>Уже зарегистрированы? Войти</Link>
    </form>
  )
}
export default Register;