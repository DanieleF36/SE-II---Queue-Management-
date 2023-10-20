import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Login } from './Components/Login';
import { Homepage } from './Components/Homepage';

function App() {

    const [errorMsg, setErrorMsg] = useState(undefined);

  
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
            <Route path='/' element={<><Homepage/></>} />
            <Route path='/login' element={<><Login loginSuccessful={loginSuccessful}/></>} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default App;