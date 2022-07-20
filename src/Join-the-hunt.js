import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import { Login } from "./Login";
import { Discord } from "./Discord";
const LS_KEY = "login-with-metamask:auth";

const qs = (key) => {
  key = key.replace(/[*+?^$.[\]{}()|\\/]/g, "\\$&"); // escape RegEx meta chars
  const match = window.location.search.match(
    new RegExp(`[?&]${key}=([^&]+)(&|$)`)
  );
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};
const Join_the_hunt = () => {
  const [referral_code, setReferralCode] = useState();
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

  const handleReferralCode = (e) => {
    setReferralCode(e.target.value);
  };

  const [called, setCalled] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      $(".bg_join_arcade").removeClass("d-none");
      $(".join-the-hunt-into").addClass("d-none");
      $("#join-the-hunt").addClass("bg_gif");
      $("#join-box").addClass("animate__fadeIn").removeClass("d-none");
    }, 2000);

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
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          if (res.publicAddress) {
            setCalled(true);
            document.getElementById("newBtn").click();
          } else {
            document.getElementById("discordErrTxt").innerHTML = res.message;
            setCalled(true);
            document.getElementById("newBtn").click();
          }
        });
    }
    // eslint-disable-next-line
  }, [qs, state]);

  const { auth } = state;

  const createReferralUser = () => {
    localStorage.setItem("referral_code", referral_code);
    document.getElementById("newBtn").click();
  };
  const noReferralCode = (e) => {
    e.preventDefault();
    console.log("No referral code");
    document.getElementById("referral-code-section").classList.add("d-none");
    document.getElementById("connection-section").classList.remove("d-none");
    document
      .getElementById("connection-section")
      .classList.add("animate__fadeIn");
  };

  return (
    <>
      <div className="join-the-hunt-into" id="join-the-hunt-into">
        <video id="entry_point" className="RH-entry-video" autoPlay muted>
          <source src="/videos/RH_join_page.mp4" type="video/mp4" />
        </video>
      </div>
      <img
        id="bg_img"
        className="img-fluid bg_join_arcade d-none"
        src="/images/RH_arcade_1.png"
        alt="retro hunters bg"
        width={1920}
        height={1080}
      />

      <section id="join-the-hunt" className="sec-pad-lg">
        <div className="container">
          <div className="row align-items-center vh-100">
            <div className="col-md-8 offset-md-2">
              <div
                id="join-box"
                className="d-none animate__animated animate__delay-2s"
              >
                <div id="referral-code-section">
                  <h2>ENTER YOUR REFERRAL CODE</h2>
                  <input
                    type="text"
                    className="input"
                    onChange={handleReferralCode}
                  />
                  <div className="referral-link">
                    <button
                      className="btn btn-default"
                      onClick={createReferralUser}
                    >
                      Enter
                    </button>
                  </div>
                  <div className="referral-code">
                    <h4>
                      IF YOU DON’T HAVE A REFERRAL CODE,{" "}
                      <a href="#" onClick={noReferralCode} id="newBtn">
                        CLICK HERE
                      </a>
                    </h4>
                  </div>
                </div>
                <div
                  id="connection-section"
                  className="d-none animate__animated animate__delay-1s"
                >
                  <h2>In order to join the hunt, you must</h2>
                  <div className="connection-buttons">
                    {auth ? (
                      <>
                        <button className="btn btn-default button-connected">
                          <img
                            className="connected float-start"
                            src="/images/connect-wallet-2.svg"
                            alt="wallet connected"
                            width={19}
                            height={32}
                          />
                          <span className="button-text">wallet connected</span>
                          <img
                            className="connected float-end"
                            src="/images/connected-tick.svg"
                            alt="account connected"
                            width={23}
                            height={16}
                          />
                        </button>
                        <Discord
                          auth={auth}
                          onLoggedOut={handleLoggedOut}
                          called={called}
                        />
                      </>
                    ) : (
                      <Login onLoggedIn={handleLoggedIn} />
                    )}
                  </div>
                  <div className="connection-text pt-50">
                    <h4>
                      {auth ? (
                        <Link to="/task">
                          {" "}
                          connecting and verifying will reward you with
                          consumable tokens, find more information on these on
                          the next page
                        </Link>
                      ) : (
                        <>
                          connecting and verifying will reward you with
                          consumable tokens, find more information on these on
                          the next page
                        </>
                      )}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        id="return-back"
        className="return-back animate__animated animate__slideInLeft animate__delay-1s"
      >
        <h5>
          <Link to="/home">RETURN TO WEBSITE</Link>
        </h5>
      </div>
    </>
  );
};
export default Join_the_hunt;
