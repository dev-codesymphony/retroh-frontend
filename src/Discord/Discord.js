import React, { useState, useEffect } from "react";

export const Discord = ({ auth, onLoggedOut, called }) => {
  const [state, setState] = useState({
    loading: false,
    user: undefined,
    username: "",
  });

  const verifydiscord = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/discord/login`;
  };

  useEffect(() => {
    const { accessToken } = auth;

    fetch(`/users/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((user) => {
        setState({ ...state, user });
      })
      .catch((error) => {});
    // eslint-disable-next-line
  }, [called]);

  const { user } = state;

  return (
    <>
      {user && user.verifiedInDiscord ? (
        <>
          <button
            id="verify_discord"
            className="btn btn-default button-connected"
          >
            <img
              className="connected float-start"
              src="/images/connect-discord-2.svg"
              alt="connected discord account"
              width={33}
              height={25}
            />
            <span className="button-text">Discord Verified</span>
            <img
              className="connected float-end"
              src="/images/connected-tick.svg"
              alt="account connected"
              width={23}
              height={16}
            />
          </button>
        </>
      ) : (
        <>
          <button
            id="verify_discord"
            className="btn btn-default"
            onClick={verifydiscord}
          >
            <img
              className="connect"
              src="/images/connect-discord.svg"
              alt="connect discord account"
              width={33}
              height={25}
            />
            <span className="button-text" id="discordErrTxt">
              Verify your discord
            </span>
            <span className="token-info">
              <span className="points">+1</span>
              <img
                src="/images/token.svg"
                alt="+1 token"
                width={32}
                height={32}
              />
            </span>
          </button>
        </>
      )}
    </>
  );
};
