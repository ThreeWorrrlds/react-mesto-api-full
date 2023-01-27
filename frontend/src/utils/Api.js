/* export const BASE_URL = 'http://localhost:3000'; */
export const BASE_URL = 'https://api.harrymidas.nomoredomains.rocks';

export const CURRENT_TOKEN = localStorage.getItem('jwt');

export class Api {
  #onResponce(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Ошибка", `${res}`);
  }

  constructor(baseUrl, headers) {
    this._headers = headers.headers;
    this._baseUrl = baseUrl;
  }

  _request(url, options) {
    return fetch(url, options).then(this.#onResponce)
  }


  getAllCards(token) {
    return this._request(`${this._baseUrl}/cards`, {
      headers: {
        "authorization": `Bearer ${token}`,
        "content-type": "application/json"
      }
    })
  }

  deleteCard(cardId) {
    return this._request(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    })
  }

  changeLike(cardId, isLike) {
    return this._request(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: isLike ? 'DELETE' : 'PUT',
      headers: this._headers
    })
  }

  changeAvatar(data) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar
      })
    })
  }

  createUserCard(data) {
    return this._request(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
  }

  getUserInfoFromServer(token) {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: {
        "authorization": `Bearer ${token}`,
        "content-type": "application/json"
      }
    })
  }

  sendUserInfoToServer(data) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
  }
}
const api = new Api(BASE_URL,
  {
    headers: {
      "authorization": `Bearer ${CURRENT_TOKEN}`,
      "content-type": "application/json"
    }
  });
export { api };

/* '9800edab-c01e-4941-9a81-bb143e90c5b8' */