function Roadmap(){
    return(
        <>
        <img id='bg_img' className='img-fluid' src='/images/bg.jpg' alt='retro hunters bg' width={1920} height={1080} />
        <section id="roadmap" className="section-roadmap">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-12">
                        <div className="page-title">
                            <h1 className="roadmap-title"><span>THE ROADMAP</span></h1>
                        </div>
                        <h2 className="sub-title">Here's what we're up to.</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-10">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="roadmap-box text-center">
                                    <h4>MINI DUNGEON</h4>
                                    <img className="img-fluid" src="/images/img-1.png" alt="MINI DUNGEON" width=""/> 
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="roadmap-box text-center">
                                    <h4>MINI DUNGEON</h4>
                                    <img className="img-fluid" src="/images/img-2.png" alt="MINI DUNGEON" width=""/> 
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="roadmap-box text-center">
                                    <h4>MINI DUNGEON</h4>
                                    <img className="img-fluid" src="/images/img-1.png" alt="MINI DUNGEON" width=""/> 
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="roadmap-box text-center">
                                    <h4>MINI DUNGEON</h4>
                                    <img className="img-fluid" src="/images/img-2.png" alt="MINI DUNGEON" width=""/> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </section>
        </>
    );
}
export default Roadmap;