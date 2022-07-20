import React from 'react';
import $ from 'jquery';
import 'tiny-slider/dist/tiny-slider.css';
import { tns } from "tiny-slider/src/tiny-slider";
import { useEffect } from "react";
const About = () => {
    useEffect(() => {
        const slider = tns({
            container: '.my-slider',
            items: 1,
            axis: 'vertical',
            controls: false,
            mouseDrag: true,
            navPosition: 'top',
            navContainer: '.nav-container',
            slideBy: 'page',
            rewind: true
        });
        $(".my-slider").on('mousewheel', '.tns-item', function (e) {
            console.log("adsfasd");
            if (e.deltaY>0) {
                slider.goTo('next');
                console.log("next slide");
            } else {
                slider.goTo('prev');
                console.log("prev slide");
            }
            e.preventDefault();
        });
      },[]);
    $(document).on( 'click', '.nav-links li a', function (e) {
        e.preventDefault();
        $(".about-section-nav .nav-links li").each(function(){
            $(this).removeClass("active");
        });
        $(this).parent("li").fadeIn().addClass("active");
        const sectionId = $(this).attr('href');
        $("section.section").each(function(){
            $(this).addClass("d-none");
        })
        $(sectionId).removeClass("d-none").addClass("animate__animated animate__zoomIn");
    });
    return(
        <>
        <img id='bg_img' className='img-fluid' src='/images/bg.jpg' alt='retro hunters bg' width={1920} height={1080} />
        
        <section id="about" className="sec-pad-lg">
            <div className="container">
                <div className="row about-us align-items-center align-middle">
                    <div className="col-md-3">
                        <div className="affix">
                        <img className='img-fluid animate__animated animate__fadeInLeft' src="/images/about-2.jpg" alt="discord" width="240"/>
                        </div>
                    </div>
                    <div className="col-md-6 about-content-sections">
                        <div className='nav-container'>
                            <div><span>section 1</span></div>
                            <div><span>section 2</span></div>
                            <div><span>section 3</span></div>
                            <div><span>section 4</span></div>
                        </div>
                        <div className='my-slider'>
                            <div>
                                <div className="content">
                                <h2>FROM THE ALLEY TO THE GARDEN</h2>
                                <p>
                                Azuki is a brand.<br/>
                                A new kind of brand that we build together.<br/>
                                A brand for the metaverse. By the community.
                                </p>
                                <p>A collection of 10,000 avatars that give you membership access to The Garden. It starts with exclusive streetwear collabs, NFT drops, live events, and much more that will be revealed over time. Community ownership in Azuki allows for a new genre of media which the world has yet to explore. An Azuki is your identity in the metaverse — let's build together.</p>
                                <p>The Garden is a corner of the internet where art, community, and culture fuse to create magic. The lines between the physical and digital worlds are blurring and the rules are being rewritten</p>
                                <a className="link-active" href='/'>WHAT WE DID <img src="/images/down-arrow.svg" alt="What we do" width={10}/></a>
                                </div>
                            </div>
                            <div>
                                <div className="content">
                                <h2>FROM THE ALLEY TO THE GARDEN</h2>
                                <p>
                                Azuki is a brand.<br/>
                                A new kind of brand that we build together.<br/>
                                A brand for the metaverse. By the community.
                                </p>
                                <p>A collection of 10,000 avatars that give you membership access to The Garden. It starts with exclusive streetwear collabs, NFT drops, live events, and much more that will be revealed over time. Community ownership in Azuki allows for a new genre of media which the world has yet to explore. An Azuki is your identity in the metaverse — let's build together.</p>
                                <p>The Garden is a corner of the internet where art, community, and culture fuse to create magic. The lines between the physical and digital worlds are blurring and the rules are being rewritten</p>
                                <a className="link-active" href='/'>WHAT WE DID <img src="/images/down-arrow.svg" alt="What we do" width={10}/></a>
                                </div>
                            </div>
                            <div>
                                <div className="content">
                                <h2>FROM THE ALLEY TO THE GARDEN</h2>
                                <p>
                                Azuki is a brand.<br/>
                                A new kind of brand that we build together.<br/>
                                A brand for the metaverse. By the community.
                                </p>
                                <p>A collection of 10,000 avatars that give you membership access to The Garden. It starts with exclusive streetwear collabs, NFT drops, live events, and much more that will be revealed over time. Community ownership in Azuki allows for a new genre of media which the world has yet to explore. An Azuki is your identity in the metaverse — let's build together.</p>
                                <p>The Garden is a corner of the internet where art, community, and culture fuse to create magic. The lines between the physical and digital worlds are blurring and the rules are being rewritten</p>
                                <a className="link-active" href='/'>WHAT WE DID <img src="/images/down-arrow.svg" alt="What we do" width={10}/></a>
                                </div>
                            </div>
                            <div>
                                <div className="content">
                                <h2>FROM THE ALLEY TO THE GARDEN</h2>
                                <p>
                                Azuki is a brand.<br/>
                                A new kind of brand that we build together.<br/>
                                A brand for the metaverse. By the community.
                                </p>
                                <p>A collection of 10,000 avatars that give you membership access to The Garden. It starts with exclusive streetwear collabs, NFT drops, live events, and much more that will be revealed over time. Community ownership in Azuki allows for a new genre of media which the world has yet to explore. An Azuki is your identity in the metaverse — let's build together.</p>
                                <p>The Garden is a corner of the internet where art, community, and culture fuse to create magic. The lines between the physical and digital worlds are blurring and the rules are being rewritten</p>
                                <a className="link-active" href='/'>WHAT WE DID <img src="/images/down-arrow.svg" alt="What we do" width={10}/></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="affix">
                        <img className='img-fluid animate__animated animate__fadeInRight' src="/images/about-1.png" alt="discord" width="240"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
    );
}
export default About;