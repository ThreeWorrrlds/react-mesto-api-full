import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  const cardDeleteButtonClassName = (
    `card__trash ${isOwn ? 'card__trash_visible' : 'card__trash_hidden'}`
  );

  const cardLikeButtonClassName = (
    `card__like ${isLiked ? 'card__like_active' : ''}`
  );

  const handleCardClick = () => {
    onCardClick(card);
  }

  const handleLikeClick = () => {
    onCardLike(card);
  }

  const handleDeleteClick = () => {
    onCardDelete(card);
  }

  return (
    <article className="card">
      <img src={card.link} alt={card.name} className="card__photo" onClick={handleCardClick} />
      <div className="card__description-group">
        <h2 className="card__place-name">{card.name}</h2>
        <div className="card__likes">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <span className="card__likescounter">{card.likes.length}</span>
        </div>
        <button type="button" className={`${cardDeleteButtonClassName} button-style`} onClick={handleDeleteClick} ></button>
      </div>
    </article>
  );
}
export default Card; 