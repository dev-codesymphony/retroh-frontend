import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import $ from 'jquery';
const Arcade = () => {
  useEffect(() => {
   
  }, []);

  return (
    <>
    <img id='bg_img' className='img-fluid' src='/images/arcade.jpg' alt='retro hunters bg' width={1920} height={1080} />
    <video id="RH-entry-video-2" className="RH-loop-entry-video" autoPlay loop muted>
        <source src="/videos/Looping-arcade-machine.mp4" type='video/mp4' />
    </video>
    <section id="join-the-hunt" className="sec-pad-lg">
        <div className="container">
            <div className="row align-items-center">
                <div className='col-md-8 offset-md-2'>
                    {/*
                {auth ? (
                <Profile auth={auth} onLoggedOut={handleLoggedOut} />
                ) : (
                <Login onLoggedIn={handleLoggedIn} />
                )}*/}
                <h2 className="text-center arcade-links">
                  <Link  to="/home" className="text-center enter-website-links">Enter the site</Link>
                  <Link  to="/join-the-hunt" state={{ from: "RH_arcade" }} className="text-center enter-website-links">Join the hunt</Link>
                </h2>
                </div>
            </div>
        </div>
    </section>
    </>
  );
};

export default Arcade;
