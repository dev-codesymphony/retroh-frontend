import React, {useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import Typed from "react-typed";
import $ from 'jquery';
import { useLocation } from "react-router-dom";
const Join_the_hunt = () => {
    //const location = useLocation();
    //const { from } = location.state;
    //const WEBURL = useRef(0);
   /* useEffect(() => {
        if(from === "RH_arcade"){
            $("button.text-link").trigger("click");
        }
        setTimeout(() => {
            $("#entry_point").addClass("d-none");
            $("#entry_loop").removeClass("d-none");
        }, 2000);
    }, []); */
    const join_hunt = () => {
        //WEBURL.current++;
        $(".back-to-arcade").addClass("d-none");
        $(".main-wrapper").addClass("d-none");
        document.getElementById("btn-txt-heading").classList.add("d-none");
        document.getElementById("join-the-hunt-into").classList.add("d-none");
        document.getElementById("bg_img").classList.remove("d-none");
        document.getElementById("bg_img").src="/images/join_hunt_1.jpg";
        //$("#machine-entry").removeClass("d-none");

        $(".video-playbox").removeClass("d-none").addClass("animate__zoomIn");
        $(".video-playbox video").html('<source src="/videos/RH-join-entry.mp4" type="video/mp4" />');
        setTimeout(() => {
            $(".video-playbox").addClass("d-none");
            $("#join-box").addClass("animate__fadeIn").removeClass("d-none");
        }, 2000);
        document.getElementById("bg_img").src="/images/join_hunt_2.jpg";
        document.getElementById("return-back").classList.remove("d-none");
    }
    return(
        <>
        <div className='join-the-hunt-into' id='join-the-hunt-into'>
        <video id="entry_loop" className="RH-entry-video" autoPlay loop muted>
            <source src="/videos/RH-home-entry.mp4" type='video/mp4' />
        </video>
        
        </div>
        <img id='bg_img' className='img-fluid d-none' src='/images/bg-3.jpg' alt='retro hunters bg' width={1920} height={1080} />
        <div className='back-to-arcade'>
            <Link to="/arcade">Back to arcade</Link>
        </div>
        <h1 id='btn-txt-heading' className="heading-text animate__animated">
            <Link className='btn text-link' to="/join-the-hunt" state={{ from: "RH_home" }}>
            <Typed
                strings={[
                        "Join The Hunt",
                    ]}
                    typeSpeed={200}
                    backSpeed={100}
                    
                    />
            </Link>
        </h1>
     
        <section id="join-the-hunt" className="sec-pad-lg">
            <div className="container">
                <div className="row align-items-center">

                    <div className='col-md-8 offset-md-2'>
                        
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
export default Join_the_hunt;