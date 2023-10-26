import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Login } from './Components/Login';
import { Logout } from './Components/Logout';
import { Homepage } from './Components/Homepage';
import { TicketView } from './Components/TicketView';
import API from './API';

function App() {

    const [errorMsg, setErrorMsg] = useState(undefined);
    const [user, setUser] = useState(undefined);
    const [loggedIn, setLoggedIn] = useState(false);
    const [services, setServices] = useState([]);
    const [ticket, setTicket] = useState('');
    const [ticketC, setTicketC] = useState(undefined);
    const [ticketD, setTicketD] = useState(undefined);
    const [selservice, setselService] = useState(undefined);

  
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

    useEffect(() => {
      //adding API from backend
      API.listServices()
        .then((services) => {
        setServices(services);
      })
      .catch((err) => handleError(err));
  
    }, []);

    const handleGetTicket = (selservice) => {
      let id=0;
      //adding API from backend for updating last customer for that service and retrieving ticket code
      setServices((oldList) => oldList.map((e) => {
        if (e.name === selservice) {
            id= e.id;
            e.last++;
            setTicket('1'+ e.code + e.last);
            setTicketC('1'+e.code+ e.current);
            setTicketD(2);
          return Object.assign({}, e);
        } else {
          return e;
        }
      })
      );

      
      
      setselService(selservice);

      API.incrLast(id)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));

      
    };

    const handleNextCustomer = () => { 
      API.nextCustomer(1).then(e=>setTicket(e.nextCustomer));
      setTicketC(ticket);
    };
  
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
      setTicket(undefined);
    }

    return (
        <>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<><Homepage handleNextCustomer={handleNextCustomer} services={services} ticketC={ticketC} ticket={ticket} selservice={selservice} handleGetTicket={handleGetTicket} loggedIn={loggedIn} loginSuccessful={loginSuccessful} user={user}/></>} />
            <Route path='/:service/ticket' element={<><TicketView ticket={ticket} ticketC={ticketC}  ticketD={ticketD} /></>} />
            <Route path='/login' element={<><Login ticket={ticket} selservice={selservice} loggedIn={loggedIn} loginSuccessful={loginSuccessful} user={user}/></>} />
            <Route path='/logout' element={<><Logout ticket={ticket} selservice={selservice} loggedIn={loggedIn} loginSuccessful={loginSuccessful} user={user} doLogOut={doLogOut}/></>} />
          </Routes>
        </BrowserRouter>
      </>
    );
}

export default App;