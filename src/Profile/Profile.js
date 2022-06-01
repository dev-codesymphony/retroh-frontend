import "./Profile.css";
import axios from "axios";
// import jwtDecode from "jwt-decode";
import React, { useState, useEffect } from "react";
import Blockies from "react-blockies";
import DiscordTokenGenerator from "../DiscordTokenGenerator/DiscordTokenGenerator";
import queryString from "query-string";
import specificAccounts from "./specificAccounts";
import handles from "./handles";
import tweets from "./tweets";

export const Profile = ({ auth, onLoggedOut }) => {
  const [state, setState] = useState({
    loading: false,
    user: undefined,
    username: "",
  });

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

  const getUserFollowingData = async (user, pagination_token = null) => {
    let url = `https://corsanywhere.herokuapp.com/https://api.twitter.com/2/users/${user}/following`;
    if (pagination_token) {
      url += `&pagination_token=${pagination_token}`;
    }
    const { data } = await axios({
      url: url,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
      },
    });
    return data;
  };

  const getUserTweetsData = async (user, pagination_token = null) => {
    let url = `https://corsanywhere.herokuapp.com/https://api.twitter.com/2/users/${user}/tweets/?tweet.fields=entities,id,in_reply_to_user_id,referenced_tweets,text`;
    if (pagination_token) {
      url += `&pagination_token=${pagination_token}`;
    }
    const { data } = await axios({
      url: url,
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
      },
    });
    return data;
  };

  const isFollowing = async function (user, tweeterId) {
    let pagination_token = null;
    let shouldRun;
    do {
      try {
        shouldRun = false;
        const data = await getUserFollowingData(user, pagination_token);
        const isFollowing = data.data.some((user) => user.id == tweeterId);
        if (isFollowing) {
          return true;
        } else {
          if (data.meta && data.meta.next_token) {
            pagination_token = data.meta.next_token;
            shouldRun = true;
          } else {
            return false;
          }
        }
      } catch (error) {
        console.error(error);
      }
    } while (shouldRun);
  };

  const hasRetweetedHandle = async function (user, handle) {
    let pagination_token = null;
    let shouldRun = false;
    do {
      try {
        shouldRun = false;
        const data = await getUserTweetsData(user, pagination_token);

        const filteredData = data.data.filter((data) => {
          return !data.entities
            ? false
              ? data.entities.referenced_tweets
              : false
            : !data.entities.mentions
            ? false
            : data.entities.mentions.some(
                (mention) => mention.username == handle
              );
        });

        const hasRetweetedHandle = filteredData.length > 0;
        if (hasRetweetedHandle) {
          return true;
        } else {
          if (data.meta && data.meta.next_token) {
            pagination_token = data.meta.next_token;
            shouldRun = true;
          } else {
            return false;
          }
        }
      } catch (error) {
        console.error(error);
      }
    } while (shouldRun);
  };

  const hasTwitterRetweeted = async function (user, tweetId) {
    let pagination_token = null;
    let shouldRun = false;
    do {
      try {
        shouldRun = false;
        const data = await getUserTweetsData(user, pagination_token);

        const filteredData = data.data.filter((data) => {
          return data.referenced_tweets
            ? data.referenced_tweets.some((tweet) => tweet.id == tweetId)
            : false;
        });

        console.log("filteredData", filteredData);

        const hasRetweetedTweet = filteredData.length > 0;
        if (hasRetweetedTweet) {
          return true;
        } else {
          if (data.meta && data.meta.next_token) {
            pagination_token = data.meta.next_token;
            shouldRun = true;
          } else {
            return false;
          }
        }
      } catch (error) {
        console.error(error);
      }
    } while (shouldRun);
  };

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
  const verifiedInDiscord = user && user.verifiedInDiscord;

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

      {isLoggedIn && (
        <div>
          {specificAccounts &&
            specificAccounts.map((account) => {
              return (
                <button
                  className="Login-button Login-email"
                  onClick={async () => {
                    const isFollowed = await isFollowing(id_str, account);
                    console.log("followed: " + isFollowed);
                    if (isFollowed) {
                      fetch(`/users/twitterFollowed`, {
                        body: JSON.stringify({ twitterFollowed: account }),
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                          "Content-Type": "application/json",
                        },
                        method: "POST",
                      })
                        .then((response) => response.json())
                        .then((user) => alert("Earned 1 arcadePoint!"))
                        .catch((err) => {
                          window.alert(err);
                        });
                    } else {
                      window.alert(
                        "Try again, You are not following this account"
                      );
                    }
                  }}
                  disabled={
                    user &&
                    user.twitterFollowed &&
                    user.twitterFollowed.includes(account)
                  }
                >
                  Follow our founder
                </button>
              );
            })}
          {handles &&
            handles.map((handle) => {
              return (
                <button
                  className="Login-button Login-email"
                  onClick={async () => {
                    const retweetedHandle = await hasRetweetedHandle(
                      id_str,
                      handle
                    );
                    console.log("retweetedHandle: " + retweetedHandle);
                    if (retweetedHandle) {
                      fetch(`/users/twitterTweetedHandle`, {
                        body: JSON.stringify({
                          tweetedHandle: handle,
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
                          window.alert(err);
                        });
                    } else {
                      window.alert(
                        "Try again, You had not retweeted this handle"
                      );
                    }
                  }}
                  disabled={
                    user &&
                    user.twitterTweetedHandle &&
                    user.twitterTweetedHandle.includes(handle)
                  }
                >
                  tweet at our handle
                </button>
              );
            })}

          {tweets &&
            tweets.map((tweet) => {
              return (
                <button
                  className="Login-button Login-email"
                  onClick={async () => {
                    const twitterRetweeted = await hasTwitterRetweeted(
                      id_str,
                      tweet
                    );
                    console.log("twitterRetweeted: " + twitterRetweeted);
                    if (twitterRetweeted) {
                      fetch(`/users/twitterRetweeted`, {
                        body: JSON.stringify({
                          twitterRetweeted: tweet,
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
                          window.alert(err);
                        });
                    } else {
                      window.alert("Try again, You had not retweeted this ");
                    }
                  }}
                  disabled={
                    user &&
                    user.twitterRetweeted &&
                    user.twitterRetweeted.includes(tweet)
                  }
                >
                  retweet at specific tweet
                </button>
              );
            })}

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
      )}

      <p>
        {!verifiedInDiscord ? (
          <DiscordTokenGenerator accessToken={accessToken} />
        ) : null}
      </p>

      <p>
        <button onClick={onLoggedOut}>Logout</button>
      </p>
    </div>
  );
};
