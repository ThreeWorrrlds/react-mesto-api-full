import React from 'react';
import PopupWithForm from './PopupWithForm.js';

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {
  const [name, setName] = React.useState('');
  const [urlImg, setUrlImg] = React.useState('');

  let buttonText = isLoading ? 'Создание...' : 'Создать';


  function handleInputNameChange(e) {
    setName(e.target.value);
  }

  function handleInputLinkChange(e) {
    setUrlImg(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name,
      link: urlImg
    })
  }

  React.useEffect(() => {
    setName('');
    setUrlImg('');
  }, [isOpen]);

  return (
    <PopupWithForm name="place" title="Новое место" buttonTxt={buttonText} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} >
      <input value={name} onChange={handleInputNameChange} id="place-name" type="text" className="popup__input popup__input_type_place-name" name="name"
        placeholder="Название" minLength="2" maxLength="30" required />
      <span className="popup__text-error place-name-error"></span>
      <input value={urlImg} onChange={handleInputLinkChange} id="place-link" type="url" className="popup__input popup__input_type_place-link" name="link"
        placeholder="Ссылка на картинку" required />
      <span className="popup__text-error place-link-error"></span>
    </PopupWithForm>
  )
}
export default AddPlacePopup;