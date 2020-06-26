import React, { useState, useEffect } from 'react';
import './App.css';
import {  BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import io from "socket.io-client";
import {ChatMain} from "./componentes/Chat";
import {FormLogin} from "./componentes/Login";
import NavBarTopo from './componentes/NavBar';
import { SidebarCanvas, SidebarVideos, SidebarChat, SidebarGlobal } from './componentes/Sidebar';
import { Player } from './componentes/Videos';
import { CanvasMain } from './componentes/Canvas';

let socket, endpoint = "https://syncplat-backend.herokuapp.com/";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthenticated = async () => {
    if(localStorage.getItem("username"))
      setIsAuthenticated(true);
  };

  useEffect(() => {
    checkAuthenticated();
});

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <Router>
      <Switch>
          <Route exact path="/" render={props => !isAuthenticated ? (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/Chat"/> )}></Route>              

          <Route path="/Chat" render={props => isAuthenticated ? (<Chat {...props} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
          
          <Route exact path="/Watch" render={props => isAuthenticated ? (<WatchVideos {...props} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>

          <Route path="/Canvas" render={props => isAuthenticated ? (<Canvas {...props} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>

        </Switch>
    </Router>
  );
}

export default App;

function Login({setAuth}) {  
  return (
    <div className="card mt-5">
        <div className="card-body">
            <h3 className="card-title text-center">SyncPlat</h3>
            <hr/>
            <FormLogin setAuth={setAuth}/>
        </div>
    </div>
  );
}

function Chat({setAuth}) {
  const logout = async e => {
    e.preventDefault();
    try {
      socket = io(endpoint);
      socket.emit('user-disconnected', localStorage.getItem("username"));

      localStorage.removeItem("username");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="d-flex" id="wrapper">
      <SidebarChat />
      <div id="page-content">
        <NavBarTopo logout={logout} />
        <div className="container-fluid">
          <ChatMain />
        </div>
      </div>
    </div>
  );
}

function WatchVideos({setAuth}) {
  const logout = async e => {
    e.preventDefault();
    try {
      socket = io(endpoint);
      socket.emit('user-disconnected', localStorage.getItem("username"));

      localStorage.removeItem("username");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
      <div className="d-flex" id="wrapper">
        <SidebarVideos />
        <SidebarGlobal />
        <div id="page-content">
          <NavBarTopo logout={logout} />
          <Player />
        </div>
      </div>
  );
}

function Canvas({setAuth}) {
  const logout = async e => {
    e.preventDefault();
    try {
      socket = io(endpoint);
      socket.emit('user-disconnected', localStorage.getItem("username"));

      localStorage.removeItem("username");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="d-flex" id="wrapper">
      <SidebarCanvas />
      <SidebarGlobal />
      <div id="page-content">
        <NavBarTopo logout={logout} />
        <CanvasMain />
      </div>
    </div>		
  );
}
