import "./Profile.css";
import axios from "axios";
import $ from "jquery";
import React, { useState, useEffect } from "react";
import queryString from "query-string";

export const Profile = ({ auth, onLoggedOut }) => {
  const [state, setState] = useState({
    loading: false,
    user: undefined,
    username: "",
  });

  const [id_str, setId_Str] = useState("");

  const [errors, setErrors] = useState({
    myBtn1: "",
    myBtn2: "",
    myBtn3: "",
    myBtn4: "",
  });
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

        setId_Str(data.id_str);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (id_str.length > 0) {
      if (localStorage.getItem("calling") == "twitterFollowedOfficial") {
        twitterFollowedOfficial();
        localStorage.setItem("calling", null);
      } else if (localStorage.getItem("calling") == "twitterFollowedFounder") {
        twitterFollowedFounder();
        localStorage.setItem("calling", null);
      } else if (localStorage.getItem("calling") == "twitterRetweeted") {
        twitterRetweeted();
        localStorage.setItem("calling", null);
      } else if (localStorage.getItem("calling") == "twitterTweetedHandle") {
        twitterTweetedHandle();
        localStorage.setItem("calling", null);
      }
    }
  }, [id_str]);

  const twitterFollowedOfficial = () => {
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
    }).then(async (response) => {
      const newres = await response.json();
      if (response.status == 400) {
        setErrors({
          ...errors,
          myBtn1: newres.message,
        });
      }
      if (response.status == 200) {
        setErrors({
          ...errors,
          myBtn1: "",
        });
        getProfile();
      }
    });
  };

  const twitterFollowedFounder = () => {
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
    }).then(async (response) => {
      const newres = await response.json();
      if (response.status == 400) {
        setErrors({
          ...errors,
          myBtn2: newres.message,
        });
      }
      if (response.status == 200) {
        getProfile();
        setErrors({
          ...errors,
          myBtn2: "",
        });
      }
    });
  };

  const twitterRetweeted = () => {
    fetch(`/users/twitterRetweeted`, {
      body: JSON.stringify({
        user: id_str,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then(async (response) => {
      const newres = await response.json();
      if (response.status == 400) {
        setErrors({
          ...errors,
          myBtn3: newres.message,
        });
      }
      if (response.status == 200) {
        getProfile();
        setErrors({
          ...errors,
          myBtn3: "",
        });
      }
    });
  };

  const twitterTweetedHandle = () => {
    fetch(`/users/twitterTweetedHandle`, {
      body: JSON.stringify({
        user: id_str,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then(async (response) => {
      const newres = await response.json();
      if (response.status == 400) {
        setErrors({
          ...errors,
          myBtn4: newres.message,
        });
      }

      if (response.status == 200) {
        getProfile();
        setErrors({
          ...errors,
          myBtn4: "",
        });
      }
    });
  };

  const getProfile = () => {
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
      .catch(window.alert);
  };

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    $(".list-item").each(function () {
      $(this)
        .find("button:disabled")
        .parents(".list-item")
        .addClass("connected");
    });
  });

  const revealedCode = () => {
    fetch(`/users/`, {
      body: JSON.stringify({ revealedCode: true }),
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

  const { user } = state;

  const _id = user && user._id;
  const arcadePoint = user && user.arcadePoint;

  const { accessToken } = auth;
  //copy refferal code to clipboard
  const copy_code = (e) => {
    e.preventDefault();
    $(document).on("click", "#copy_code", function () {
      const referral_link = _id;
      navigator.clipboard.writeText(referral_link);
    });
  };
  return (
    <>
      <div className="row token-balance hidden_join">
        <div className="col-6">
          <h4>Token balance:</h4>
        </div>
        <div className="col-6 text-end">
          <h5 className="token-balance-count">
            {" "}
            {arcadePoint}
            <img
              src="/images/token.svg"
              alt="Token Balance"
              width={32}
              height={32}
            />
          </h5>
        </div>
      </div>

      <>
        <div className="row task-listing">
          <div className="col-sm-6">
            <div className="list-item row align-items-center">
              <div className="col-2 text-center">1</div>
              <div className="col-8 p-0">
                <button
                  className="Login-button Login-email"
                  id="myBtn1"
                  onClick={() => {
                    if (id_str.length === 0) {
                      localStorage.setItem(
                        "calling",
                        "twitterFollowedOfficial"
                      );
                      login();
                    } else {
                      twitterFollowedOfficial();
                    }
                  }}
                  disabled={
                    user &&
                    user.twitterFollowed &&
                    user.twitterFollowed.includes("official")
                  }
                >
                  {errors.myBtn1.length > 0
                    ? errors.myBtn1
                    : "Follow our Official account"}
                </button>
              </div>
              <div className="d-flex col-2 align-items-center">
                <span className="task-info d-flex align-items-center">
                  <h5 className="points">+1</h5>
                  <img
                    src="/images/token.svg"
                    alt="+1 token"
                    width={32}
                    height={32}
                  />
                </span>
                <img
                  className="connected"
                  src="/images/connected-tick.svg"
                  alt="account connected"
                  width={23}
                  height={16}
                />
              </div>
            </div>
            <div className="list-item row align-items-center">
              <div className="text-center col-2">2</div>
              <div className="col-8 p-0">
                <button
                  className="Login-button Login-email"
                  id="myBtn2"
                  onClick={async () => {
                    if (id_str.length === 0) {
                      login();
                      localStorage.setItem("calling", "twitterFollowedFounder");
                      twitterFollowedFounder();
                    } else {
                      twitterFollowedFounder();
                    }
                  }}
                  disabled={
                    user &&
                    user.twitterFollowed &&
                    user.twitterFollowed.includes("founder")
                  }
                >
                  {errors.myBtn2.length > 0
                    ? errors.myBtn2
                    : "Follow our founder"}
                </button>
              </div>
              <div className="d-flex col-2 align-items-center">
                <span className="task-info d-flex align-items-center">
                  <h5 className="points">+1</h5>
                  <img
                    src="/images/token.svg"
                    alt="+1 token"
                    width={32}
                    height={32}
                  />
                </span>
                <img
                  className="connected"
                  src="/images/connected-tick.svg"
                  alt="account connected"
                  width={23}
                  height={16}
                />
              </div>
            </div>
            <div className="list-item row align-items-center">
              <div className="text-center col-2">3</div>
              <div className="col-8 p-0">
                <button
                  className="Login-button Login-email"
                  id="myBtn3"
                  onClick={() => {
                    if (id_str.length === 0) {
                      login();
                      localStorage.setItem("calling", "twitterRetweeted");
                    } else {
                      twitterRetweeted();
                    }
                  }}
                  disabled={
                    user &&
                    user.twitterRetweeted &&
                    user.twitterRetweeted.length > 0
                  }
                >
                  {errors.myBtn3.length > 0
                    ? errors.myBtn3
                    : "Show us some love"}{" "}
                </button>
              </div>
              <div className="d-flex col-2 align-items-center">
                <span className="task-info d-flex align-items-center">
                  <h5 className="points">+1</h5>
                  <img
                    src="/images/token.svg"
                    alt="+1 token"
                    width={32}
                    height={32}
                  />
                </span>
                <img
                  className="connected"
                  src="/images/connected-tick.svg"
                  alt="account connected"
                  width={23}
                  height={16}
                />
              </div>
            </div>
            <div className="list-item row align-items-center">
              <div className="text-center col-2">4</div>
              <div className="col-8 p-0">
                <button
                  id="myBtn4"
                  className="Login-button Login-email"
                  onClick={async () => {
                    if (id_str.length === 0) {
                      login();
                      localStorage.setItem("calling", "twitterTweetedHandle");
                    } else {
                      twitterTweetedHandle();
                    }
                  }}
                  disabled={
                    user &&
                    user.twitterTweetedHandle &&
                    user.twitterTweetedHandle.length > 0
                  }
                >
                  {errors.myBtn4.length > 0 ? errors.myBtn4 : "Tweet at us"}{" "}
                </button>
              </div>
              <div className="d-flex col-2 align-items-center">
                <span className="task-info d-flex align-items-center">
                  <h5 className="points">+1</h5>
                  <img
                    src="/images/token.svg"
                    alt="+1 token"
                    width={32}
                    height={32}
                  />
                </span>
                <img
                  className="connected"
                  src="/images/connected-tick.svg"
                  alt="account connected"
                  width={23}
                  height={16}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-6 items-list-col-2">
            <div className="list-item row align-items-center">
              <div className="text-center col-2">5</div>
              <div className="col-8 p-0">
                <button
                  className="Login-button Login-email"
                  id="refer_friends"
                  onClick={async () => {
                    revealedCode();
                  }}
                  disabled={user && user.revealedCode}
                >
                  Refer friends
                </button>
              </div>
              <div className="d-flex col-2 align-items-center">
                <span className="task-info d-flex align-items-center">
                  <h5 className="points">+1</h5>
                  <img
                    src="/images/token.svg"
                    alt="+1 token"
                    width={32}
                    height={32}
                  />
                </span>
                <img
                  className="connected"
                  src="/images/connected-tick.svg"
                  alt="account connected"
                  width={23}
                  height={16}
                />
              </div>
            </div>
            <div className="list-item row align-items-center">
              <h3>
                each referral will grant one token for yourself, as well as the
                referred party
              </h3>
            </div>
            {user && user.revealedCode && (
              <div className="list-item row align-items-center referral-code">
                <h3>
                  <span className="user-referral-code">{_id}</span>{" "}
                  <a
                    href="#"
                    id="copy_code"
                    className="text-end"
                    onClick={copy_code}
                  >
                    COPY CODE
                  </a>
                </h3>
              </div>
            )}
          </div>
        </div>
      </>
    </>
  );
};
