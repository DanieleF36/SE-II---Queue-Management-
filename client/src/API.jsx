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

async function nextCustomer(idCounter) {
  const response = await fetch(URL + '/nextCustomer/'+idCounter, {
    method: 'PUT',
    credentials: 'include'
  });
  const userInfo = await response.json();
  if (response.ok) {
    console.log(JSON.stringify(userInfo));
    return userInfo;
  } else {
    throw userInfo;
  }
}

async function listServices() { 
  // call  /api/services
  const response = await fetch(URL+`/services`);
  const services = await response.json();
  if (response.ok) {
    return services.map((e) => ({ id: e.id, code: e.code, name: e.name, 
                                  current: parseInt(e.current), 
                                  last: parseInt(e.last), 
                                  averageTime: parseInt(e.averageTime),}) );
  } else {
    throw services;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}
async function getService(id) { 
  // call  /api/services
  const response = await fetch(URL+`/services/${id}`);
  const service = await response.json();
  if (response.ok) {
    const e = service;
    return { id: e.id, code: e.code, name: e.name, current: parseInt(e.current), last: parseInt(e.last), averageTime: parseInt(e.averageTime)};
  } else {
    throw service;  // mi aspetto che sia un oggetto json fornito dal server che contiene l'errore
  }
}
function incrLast(id) {
  // call  POST /api/services/<id>/
  return new Promise((resolve, reject) => {
    fetch(URL+`/services/${id}`, {
      method: 'POST',   
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response1." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}


const API = {logIn, logOut, getUserInfo, nextCustomer, incrLast, getService, listServices};

export default API;