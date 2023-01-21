import React from 'react';
import PopupWithForm from './PopupWithForm.js';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
  const urlAvatar = React.useRef();
  let buttonText = isLoading ? 'Сохранение...' : 'Сохранить';

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: urlAvatar.current.value
    });
  }

  return (
    <PopupWithForm name="avatar" title="Обновить аватар" buttonTxt={buttonText} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} >
      <input ref={urlAvatar} id="avatar-link" type="url" className="popup__input popup__input_type_avatar-link" name="link"
        placeholder="Ссылка на картинку" required />
      <span className="popup__text-error avatar-link-error"></span>
    </PopupWithForm>
  )
}
export default EditAvatarPopup;