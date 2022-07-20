import React, {useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import $ from 'jquery';
function Home(){
    useEffect(() => {
        setTimeout(() => {
            $("#RH-entry-video").addClass("d-none");
            $(".RH-loop-entry-video").removeClass("d-none");
        }, 8000);
    }, []); 
    return(
        <>
        <img id="bg_img" className='img-fluid d-none animate__animated' src='/images/bg-1.jpg' alt='retro hunters bg' width={1920} height={1080} />
        <video id="RH-entry-video" className="RH-entry-video" autoPlay muted>
            <source src="/videos/RH_Site_Entry.mp4" type='video/mp4' />
        </video>
        <video id="RH-entry-video-2" className="RH-loop-entry-video d-none" autoPlay loop muted>
            <source src="/videos/Looping-arcade-machine.mp4" type='video/mp4' />
        </video>
        <section id="Home-page" className="rh-home">
            <div className="container">
                <div className="row">
                    <div className="column entry-1">
                        <Link to="/home" className="text-center enter-website-links">
                                Enter the website
                        </Link>
                        <Link to="/join-the-hunt" state={{ from: "RH_home" }} className="text-center enter-website-links">
                                Join The Hunt
                        </Link>
                    </div>
                </div>               
            </div>
        </section>
        </>
    );
}
export default Home;