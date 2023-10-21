import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Login } from './Components/Login';
import { Logout } from './Components/Logout';
import { Homepage } from './Components/Homepage';
import API from './API';

function App() {

    const [errorMsg, setErrorMsg] = useState(undefined);
    const [user, setUser] = useState(undefined);
    const [loggedIn, setLoggedIn] = useState(false);

  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const user = await API.getUserInfo();
          setLoggedIn(true);
          setUser(user);
        } catch (err) {
        }
      };
      checkAuth();
    }, []);
  
    function handleError(err) {
      let errMsg = `Unknown Server error`;
      if (err.errors) {
        if (err.errors[0])
          if (err.errors[0].msg)
            errMsg = err.errors[0].msg;
      } else if (err.error) {
        errMsg = err.error;
      }
  
      setErrorMsg(errMsg);
    }
  
    const doLogOut = async () => {
      await API.logOut();
      setLoggedIn(false);
      setUser(undefined);
    }
  
  
    const loginSuccessful = (user) => {
      setUser(user);
      setLoggedIn(true);
    }

    return (
        <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<><Homepage loggedIn={loggedIn} loginSuccessful={loginSuccessful} user={user}/></>} />
            <Route path='/login' element={<><Login loggedIn={loggedIn} loginSuccessful={loginSuccessful} user={user}/></>} />
            <Route path='/logout' element={<><Logout loggedIn={loggedIn} loginSuccessful={loginSuccessful} user={user} doLogOut={doLogOut}/></>} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default App;