import "./Profile.css";
import axios from "axios";
// import jwtDecode from "jwt-decode";
import React, { useState, useEffect } from "react";
import Blockies from "react-blockies";
import queryString from "query-string";

const qs = (key) => {
  key = key.replace(/[*+?^$.[\]{}()|\\/]/g, "\\$&"); // escape RegEx meta chars
  const match = window.location.search.match(
    new RegExp(`[?&]${key}=([^&]+)(&|$)`)
  );
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};

export const Profile = ({ auth, onLoggedOut }) => {
  const [state, setState] = useState({
    loading: false,
    user: undefined,
    username: "",
  });

  const [called, setCalled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [status, setStatus] = useState();
  const [url, setUrl] = useState();
  const [id_str, setId_Str] = useState();

  const login = () => {
    (async () => {
      try {
        //OAuth Step 1
        const response = await axios({
          url: `/twitter/oauth/request_token`,
          method: "POST",
        });

        const { oauth_token } = response.data;
        //Oauth Step 2
        window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
      } catch (error) {
        console.error(error);
      }
    })();
  };

  useEffect(() => {
    const token = qs("token");
    if (token && !called) {
      setCalled(true);
      fetch(`/users/verifyDiscord`, {
        body: JSON.stringify({
          token,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errorMsg) {
            alert(res.errorMsg);
          } else {
            alert("Discord verified!");
          }
        })
        .catch((error) => {
          window.alert(error.message);
        });
    }
    // eslint-disable-next-line
  }, []);

  const logout = () => {
    (async () => {
      try {
        await axios({
          url: `/twitter/logout`,
          method: "POST",
        });
        setIsLoggedIn(false);
      } catch (error) {
        console.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      const { oauth_token, oauth_verifier } = queryString.parse(
        window.location.search
      );

      if (oauth_token && oauth_verifier) {
        try {
          //Oauth Step 3
          await axios({
            url: `/twitter/oauth/access_token`,
            method: "POST",
            data: { oauth_token, oauth_verifier },
          });
        } catch (error) {
          console.error(error);
        }
      }

      try {
        //Authenticated Resource Access
        const { data } = await axios({
          url: `/twitter/users/profile_banner`,
          method: "GET",
        });

        setIsLoggedIn(true);
        setName(data.name);
        setId_Str(data.id_str);
        setImageUrl(data.profile_image_url_https);
        setStatus(data.status.text);
        setUrl(data.entities.url.urls[0].expanded_url);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    const { accessToken } = auth;
    // const {
    //   payload: { id },
    // } = jwtDecode(accessToken);

    fetch(`/users/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((user) => {
        setState({ ...state, user });
      })
      .catch(window.alert);
    // eslint-disable-next-line
  }, []);

  const handleChange = ({ target: { value } }) => {
    setState({ ...state, username: value });
  };

  const handleSubmit = () => {
    const { accessToken } = auth;
    const { user, username } = state;

    setState({ ...state, loading: true });

    if (!user) {
      window.alert(
        "The user id has not been fetched yet. Please try again in 5 seconds."
      );
      return;
    }

    fetch(`/users/`, {
      body: JSON.stringify({ username }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((user) => setState({ ...state, loading: false, user }))
      .catch((err) => {
        window.alert(err);
        setState({ ...state, loading: false });
      });
  };

  // const { accessToken } = auth;

  // const {
  //   payload: { publicAddress },
  // } = jwtDecode(accessToken);

  const { loading, user } = state;

  const username = user && user.username;
  const publicAddress = user && user.publicAddress;
  const _id = user && user._id;
  const arcadePoint = user && user.arcadePoint;

  const { accessToken } = auth;

  return (
    <div className="Profile">
      <p>
        Logged in as <Blockies seed={publicAddress} />
      </p>
      <div>
        My username is {username ? <pre>{username}</pre> : "not set."} My
        publicAddress is <pre>{publicAddress}</pre>
        My arcadePoint is <pre>{arcadePoint}</pre>
      </div>
      <div>
        <label htmlFor="username">Change username: </label>
        <input name="username" onChange={handleChange} />
        <button disabled={loading} onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <button
        className="Login-button Login-email"
        onClick={() => {
          alert(
            `${
              window.location.protocol +
              "//" +
              window.location.hostname +
              ":" +
              window.location.port
            }/?referredby=${_id}`
          );
        }}
      >
        Find Invite Link
      </button>

      {!isLoggedIn && (
        <img
          className="signin-btn"
          onClick={login}
          alt="Twitter login button"
          src="https://assets.klaudsol.com/twitter.png"
        />
      )}

      {user && user.verifiedInDiscord ? null : (
        <div>
          <div>Get Discord Token</div>
          <div>
            {(qs("token") && (
              <div>
                <div>Your token</div>
                <div>{qs("token")}</div>
                <div>Scope</div>
                <div>identify</div>
              </div>
            )) || (
              <a
                href={`${process.env.REACT_APP_BACKEND_URL}/api/discord/login`}
              >
                Login through Discord
              </a>
            )}
          </div>
        </div>
      )}
      {isLoggedIn && (
        <>
          <div>
            <button
              className="Login-button Login-email"
              onClick={async () => {
                fetch(`/users/twitterFollowed`, {
                  body: JSON.stringify({
                    twitterFollowed: "founder",
                    user: id_str,
                  }),
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                })
                  .then((response) => response.json())
                  .then((user) => alert("Earned 1 arcadePoint!"))
                  .catch((err) => {
                    window.alert(err.message);
                  });
              }}
              disabled={
                user &&
                user.twitterFollowed &&
                user.twitterFollowed.includes("founder")
              }
            >
              Follow our Founder
            </button>
            <button
              className="Login-button Login-email"
              onClick={async () => {
                fetch(`/users/twitterFollowed`, {
                  body: JSON.stringify({
                    twitterFollowed: "official",
                    user: id_str,
                  }),
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                })
                  .then((response) => response.json())
                  .then((user) => alert("Earned 1 arcadePoint!"))
                  .catch((err) => {
                    window.alert(err.message);
                  });
              }}
              disabled={
                user &&
                user.twitterFollowed &&
                user.twitterFollowed.includes("official")
              }
            >
              Follow our offical account
            </button>
            <button
              className="Login-button Login-email"
              onClick={async () => {
                fetch(`/users/twitterTweetedHandle`, {
                  body: JSON.stringify({
                    user: id_str,
                  }),
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                })
                  .then((response) => response.json())
                  .then((user) => alert("Earned 1 arcadePoint!"))
                  .catch((err) => {
                    window.alert(err.message);
                  });
              }}
              disabled={
                user &&
                user.twitterTweetedHandle &&
                user.twitterTweetedHandle.length > 0
              }
            >
              tweet at our handle
            </button>
            <button
              className="Login-button Login-email"
              onClick={async () => {
                fetch(`/users/twitterRetweeted`, {
                  body: JSON.stringify({
                    user: id_str,
                  }),
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                })
                  .then((response) => response.json())
                  .then((user) => alert("Earned 1 arcadePoint!"))
                  .catch((err) => {
                    window.alert(err.message);
                  });
              }}
              disabled={
                user &&
                user.twitterRetweeted &&
                user.twitterRetweeted.length > 0
              }
            >
              retweet at specific tweet
            </button>
            <div>
              <img alt="User profile" src={imageUrl} />
            </div>
            <div>Name: {name}</div>
            <div>URL: {url}</div>
            <div>Status: {status}</div>
            <button className="signout-btn" onClick={logout}>
              Sign Out
            </button>
          </div>
        </>
      )}

      <p>
        <button onClick={onLoggedOut}>Logout</button>
      </p>
    </div>
  );
};
