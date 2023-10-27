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

  async function getServicesByCounter(id) {
    const response = await fetch(URL + `/servicesbycounter/${id}`, {
    });
    const services = await response.json();
    if (response.ok) {
      return services;
    } else {
      throw services;
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
  
  /*
  * Add a new service to the counter
  * @param {int} counterId
  * @param {string}  serviceName
  */
  async function addServiceToCounter(counterId, serviceName, officerId) {
    try {
      const response = await fetch(URL + `/add`, {
        method: "POST",
        headers: {
         'Content-Type': 'application/json',
         },
        body: JSON.stringify({
          counter: counterId,
          service: serviceName,
          officer_id : officerId
        }),
        credentials: "include",
      });
      if (response.ok) {
        return true;
      } else {
        const message = response.text();
        throw new Error(message);
      }
    } catch (error) {
      throw new Error(error.message, { cause: error });
    }
  }
  
  
 //  /*
 //   * Remove a service to the counter
 //   * @param {int} counterId
 //   * @param {string}  serviceName
 //   */
 //  async function removeServiceToCounter(counterId, serviceName) {
 //    try {
 //      const response = await fetch(URL + `/counter`, {
 //        method: "DELETE",
 //        headers: {
 //          "Content-Type": "application/json",
 //        },
 //        body: JSON.stringify({
 //          counterId: counterId,
 //          serviceName: serviceName,
 //        }),
 //        credentials: "include",
 //      });
 //      if (response.ok) {
 //        return true;
 //      } else {
 //        const message = response.text();
 //        throw new Error(message);
 //      }
 //    } catch (error) {
 //      throw new Error(error.message, { cause: error });
 //    }
 //  }
  
  
  /*
   * Get the list of all the counter, services and officer
   */
  async function getCounterDetails() {
   const response = await fetch(URL + `/counter`);
   const counter = await response.json();
   if(response.ok){
     return counter
    } else {
      throw counter;
    }
  }
 
   /*
   * Get the number of the counter
   */
   async function getCounterNumber() {
     console.log("API")
     const response = await fetch(URL + `/counter/number`);
     const counterNum = await response.json();
     if(response.ok){
       return counterNum.map((e) => ({
         id : e.id,
         name : e.name,}));
      } else {
        throw counterNum;
      }
 }
 
   /*
   * Get the officer id
   */
   async function getOfficer() {
     const response = await fetch(URL + `/officer`);
     const officer = await response.json();
     if(response.ok){
       return officer
      } else {
        throw officer;
      }
 }

const API = {logIn, logOut, getUserInfo, nextCustomer, incrLast, getService, listServices, getServicesByCounter,getCounterDetails, getCounterNumber, getOfficer, addServiceToCounter};

export default API;