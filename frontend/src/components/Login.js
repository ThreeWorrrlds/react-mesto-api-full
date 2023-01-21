import React from 'react';

function Login({ handleLogin }) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  function handleInputEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleInputPasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleLogin(email, password);
  }

  return (
    <form className="login__form" autoComplete="off" onSubmit={handleSubmit} >
      <h2 className="login__header">Вход</h2>
      <input value={email} onChange={handleInputEmailChange} id="email" type="email" className="login__input" name="email"
        placeholder="Email" minLength="3" maxLength="30" required />
      <span className="login__text-error login-email-error"></span>
      <input value={password} onChange={handleInputPasswordChange} id="password" type="password" className="login__input " name="password"
        placeholder="Пароль" minLength="8" maxLength="30" required />
      <span className="login__text-error login-password-error"></span>
      <button type="submit" className="login__button-submit">Войти</button>
    </form>
  )
}
export default Login;