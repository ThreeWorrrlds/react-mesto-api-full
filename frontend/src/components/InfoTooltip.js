import React from 'react';
import authSuccess from '../images/Auth-success.svg';
import authFailed from '../images/Auth-failed.svg';

function InfoTooltip({ isOpen, registerSuccess, onClose }) {

  const icon = registerSuccess === 'success' ? authSuccess : authFailed;
  const text = registerSuccess === 'success' ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.';
  const altImg = registerSuccess === 'success' ? 'круг с галочкой внутри' : 'круг с крестиком внутри';

  return (
    <div className={`popup popup_type_authorization ${isOpen !== false ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <img src={icon} alt={altImg} className="popup__result-img" />
        <h2 className="popup__message">{text}</h2>
        <button type="button" onClick={onClose} className="popup__button-close button-style"></button>
      </div>
    </div>
  )
}
export default InfoTooltip;