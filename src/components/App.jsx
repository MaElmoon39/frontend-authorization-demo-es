import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from '../utils/auth';
import * as api from "../utils/api";
import { setToken, getToken } from "../utils/token";
import "./styles/App.css";

function App() {
  const [userData, setUserData] = useState({ username: '', email: ''});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  const handleRegistration = ({ username, email, password, confirmPassword, }) => {
    if (password === confirmPassword) {
      auth.register(username, password, email)
      .then(() => {
        //TODO:
        console.log('El proceso de registro ha sido exitoso');
        navigate('/login');
      }).catch(console.error);
    }
  };

  const handleLogin = ({ username, password }) => {
    if(!username || !password) {
      return;
    }
    auth.authorize(username, password)
      .then((data) => {
        console.log('Inicio de sesión correcto');
        if(data.jwt) {
          setToken(data.jwt);
          setUserData(data.user);
          setIsLoggedIn(true);
          const redirectPath = location.state?.from?.pathname || '/ducks';
          navigate(redirectPath);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    const jwt = getToken();
    console.log(jwt);
    if(!jwt) {
      return;
    }
    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        setIsLoggedIn(true);
        setUserData({ username, email });
        // navigate('/ducks'); <--- se elimina, ya no es necesaria
      })
      .catch(console.error);
  }, []);

  return (
    <Routes>
      <Route path="/ducks" element={
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <Ducks />
        </ProtectedRoute>
      } />
      <Route path="/my-profile" element={
        <ProtectedRoute isLoggedIn={isLoggedIn}>
          <MyProfile userData={userData} />
        </ProtectedRoute>
      } />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin}/>
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
        }
      />
      <Route path="*" element= {
        isLoggedIn ? (
          <Navigate to="/ducks" replace />
        ) : (
          <Navigate to="/login" replace />
        )
      }/>
    </Routes>
  );
}

export default App;
