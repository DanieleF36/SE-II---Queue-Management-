import dayjs from "dayjs";

const URL = 'http://localhost:3001/api';


async function logIn(credentials) {
    let response = await fetch(URL + '/sessions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  async function logOut() {
    await fetch(URL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
  }
  
  async function getUserInfo() {
    const response = await fetch(URL + '/sessions/current', {
      credentials: 'include'
    });
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;
    }
  }

  /**
 * Add a new service to a counter
 * @param {string} service
 * @param {int}  counterId
 * @param {date} date
 * @param {int} number
 */
async function configureCounter(service, counterId, date, number) {
  try {
    const response = await fetch(APIURL + `/counter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service: service,
        counter: counterId,
        date: date,
        number: number
      }),
      credentials: "include",
    });
    if (response.ok) {
      const id = Number(await response.text());
      return id;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}
  


const API = {logIn, logOut, getUserInfo, configureCounter};

export default API;