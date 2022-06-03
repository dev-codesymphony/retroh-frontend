import "./App.css";

import React, { useEffect, useState } from "react";

import { Login } from "./Login";
import { Profile } from "./Profile";
import logo from "./logo.svg";

const LS_KEY = "login-with-metamask:auth";

const qs = (key) => {
  key = key.replace(/[*+?^$.[\]{}()|\\/]/g, "\\$&"); // escape RegEx meta chars
  const match = window.location.search.match(
    new RegExp(`[?&]${key}=([^&]+)(&|$)`)
  );
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};

const App = () => {
  const [state, setState] = useState({});

  useEffect(() => {
    // Access token is stored in localstorage
    const ls = window.localStorage.getItem(LS_KEY);
    const auth = ls && JSON.parse(ls);
    setState({ auth });
  }, []);

  const handleLoggedIn = (auth) => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    setState({ auth });
  };

  const handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    setState({ auth: undefined });
  };

  useEffect(() => {
    const token = qs("token");

    if (token && state && state.auth && state.auth.accessToken) {
      fetch(`/users/verifyDiscord`, {
        body: JSON.stringify({
          token,
        }),
        headers: {
          Authorization: `Bearer ${state.auth.accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => {});
    }
    // eslint-disable-next-line
  }, [qs]);

  const { auth } = state;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to Login with MetaMask Demo</h1>
      </header>
      <div className="App-intro">
        {auth ? (
          <Profile auth={auth} onLoggedOut={handleLoggedOut} />
        ) : (
          <Login onLoggedIn={handleLoggedIn} />
        )}
      </div>
    </div>
  );
};

export default App;
