import React from 'react';
import logo from '../images/logo.svg';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';

function Header({ emailProfile }) {
  const { path, url } = useRouteMatch();
  const history = useHistory();

  function signOut() {
    localStorage.removeItem('token');
    history.push('/sign-in');
  }

  return (
    <header className="header">
      <img src={logo} alt="Логотип 'Место'" className="header__logo" />
      {path === '/sign-in' && <Link className="header__link-auth" to='/sign-up'>Зарегистрироваться</Link>}
      {path === '/sign-up' && <Link className="header__link-auth" to='/sign-in'>Войти</Link>}
      {path === '/' &&
        <nav className="header__profile-nav">
          <Link className="header__link-email" to='/' >{emailProfile}</Link>
          <button onClick={signOut} className="header__link-exit" type='text'>Выйти</button>
        </nav>
      }
    </header>
  );
}
export default Header;