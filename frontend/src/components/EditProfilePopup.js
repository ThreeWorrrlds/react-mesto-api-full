import React from 'react';
import PopupWithForm from './PopupWithForm.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {

  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  let buttonText = isLoading ? 'Сохранение...' : 'Сохранить';

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleInputNameChange(e) {
    setName(e.target.value);
  }

  function handleInputDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm name="profile" title="Редактировать профиль" buttonTxt={buttonText} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} >
      <input onChange={handleInputNameChange} id="profile-name" type="text" className="popup__input popup__input_type_name" name="name"
        placeholder="Введите имя" minLength="2" maxLength="40" value={name || ''} required />
      <span className="popup__text-error profile-name-error"></span>
      <input onChange={handleInputDescriptionChange} id="profile-description" type="text" className="popup__input popup__input_type_job" name="job" value={description || ''}
        placeholder="Ваши увлечения, хобби, род деятельности" minLength="2" maxLength="200" required />
      <span className="popup__text-error profile-description-error"></span>
    </PopupWithForm>
  )
}
export default EditProfilePopup;