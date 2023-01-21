import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import { api } from '../utils/Api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip.js';
import ProtectedRoute from './ProtectedRoute.js';
import * as auth from '../utils/auth.js';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = React.useState([]);   //ABCD
  const [loggedIn, setLoggedIn] = useState(false);

  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);

  const [emailProfile, setEmailProfile] = useState('');
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard || isRegisterPopupOpen;

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) { // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  useEffect(() => {
    api.getUserInfoFromServer()
      .then((dataUser) => {
        setCurrentUser(dataUser);
      })
      .catch((err) => {
        console.log('Данные не получены', err);
      })
  }, []);

  useEffect(() => {
    api.getAllCards()
      .then((dataCards) => {
        setCards(dataCards);
      })
      .catch((err) => {
        console.log('Данные не получены', err);
      })
  }, []);

  function checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getContent(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setEmailProfile(res.data.email);
            history.push('/');
          }
        })
        .catch((err) => {
          console.log('checkToken', err);
        })
    }
  }
  useEffect(() => {
    checkToken();
  }, [])

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api.createUserCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log('Данные не получены', err);
      })
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards([...cards].filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log('Данные не получены', err);
      })
  }

  function handleUpdateUser(user) {
    setIsLoading(true);
    api.sendUserInfoToServer(user)
      .then((dataUser) => {
        setCurrentUser(dataUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleUpdateAvatar(urlImg) {
    setIsLoading(true);
    api.changeAvatar(urlImg)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleRegister(email, password) {
    if (email && password) {
      auth.register(email, password)
        .then((res) => {
          setRegisterSuccess('success');
          history.push('/sign-in');
        })
        .catch((err) => {
          setRegisterSuccess('failed');
          console.log(err);
        })
        .finally(() => {
          setIsRegisterPopupOpen(true);
        })
    }
  }

  function handleLogin(email, password) {
    if (!email || !password) {
      return;
    }
    auth.login(email, password)
      .then((data) => {
        if (data.token) {
          history.push('/');
          setLoggedIn(true);
          setEmailProfile(email);
          console.log(data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsRegisterPopupOpen(false);
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>

        <Switch>
          <Route path='/sign-in'>
            <Header />
            <Login handleLogin={handleLogin} />
            <InfoTooltip
              registerSuccess={registerSuccess}
              isOpen={isRegisterPopupOpen}
              onClose={closeAllPopups}
            />
          </Route>

          <Route path='/sign-up'>
            <Header />
            <Register handleRegister={handleRegister} />
            <InfoTooltip
              registerSuccess={registerSuccess}
              isOpen={isRegisterPopupOpen}
              onClose={closeAllPopups}
            />
          </Route>

          <Route exact path='/'>
            <Header emailProfile={emailProfile} />
            <ProtectedRoute
              Component={Main}
              loggedIn={loggedIn}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={(data) => setSelectedCard(data)}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
            <Footer />
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} isLoading={isLoading} />
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading} />
            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={isLoading} />
          </Route>

          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>
      </CurrentUserContext.Provider>
    </div>
  );
}
export default App;
