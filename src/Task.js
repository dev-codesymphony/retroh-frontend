import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import { Login } from "./Login";
import { Profile } from "./Profile";
const LS_KEY = "login-with-metamask:auth";

const Task = () => {
  useEffect(() => {
    // Access token is stored in localstorage
    const ls = window.localStorage.getItem(LS_KEY);
    const auth = ls && JSON.parse(ls);
    setState({ auth });

    const timer = setTimeout(() => {
      $(".bg_join_arcade").removeClass("d-none");
      $(".join-the-hunt-into").addClass("d-none");
      $("#task").addClass("bg_gif");
      $("#tasks-section").addClass("animate__fadeIn");
      $("#tasks-section").removeClass("d-none");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [state, setState] = useState({});

  const handleLoggedIn = (auth) => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    setState({ auth });
  };

  const handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    setState({ auth: undefined });
  };

  const { auth } = state;

  return (
    <>
      <div className="join-the-hunt-into" id="join-the-hunt-into">
        <video id="entry_point" className="RH-entry-video" autoPlay muted>
          <source src="/videos/RH_Arcade_Glitch_Clown.mp4" type="video/mp4" />
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

      <section id="task" className="rh-task">
        <div className="container">
          <div className="row align-items-center vh-100">
            <div className="col-md-8 offset-md-2">
              <div
                id="tasks-section"
                className="d-none animate__animated animate__delay-1s"
              >
                <div className="tasks-inner">
                  <h4>
                    COMPLETE YOUR TASKS BELOW TO
                    <br />
                    EARN YOUR ARCADE TOKENS… <br />
                    STAY TUNED TO FIND OUT WHERE YOU CAN SPEND
                    <br />
                    THEM IN THE NEAR FUTURE ;) ////////
                  </h4>
                  <div className="tasks-list">
                    {auth ? (
                      <>
                        <Profile auth={auth} onLoggedOut={handleLoggedOut} />
                      </>
                    ) : (
                      <Login onLoggedIn={handleLoggedIn} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="return-back animate__animated animate__slideInLeft animate__delay-1s">
        <h5>
          <Link to="/home">RETURN TO WEBSITE</Link>
        </h5>
      </div>
    </>
  );
};
export default Task;
