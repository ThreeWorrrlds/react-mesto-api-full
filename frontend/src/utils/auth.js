
export const BASE_URL = 'https://auth.nomoreparties.co';

function checkResponce(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject("Ошибка", `${res}`);
}

export function register(email, password) {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((res) => {
      return checkResponce(res);
    })
};

export function login(email, password) {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((res) => {
      return checkResponce(res);
    })
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        return data;
      }
    })
};

export function getContent(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then((res) => {
      return checkResponce(res);
    })
};  