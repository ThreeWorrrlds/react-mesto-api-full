import React from 'react';

function ImagePopup({ card, onClose }) {

  return (
    <div className={`popup popup-view-photo ${card ? 'popup_opened' : ''}`}>
      <div className="popup__container-photo">
        <img src={card?.link} alt={card?.name}
          className="popup__photo" />
        <p className="popup__photo-description">{card?.name}</p>
        <button type="button" className="popup__button-close button-style" onClick={onClose} ></button>
      </div>
    </div>
  );
}
export default ImagePopup;