import {Link} from "react-router-dom";
function Header() {
    return (	
	<div className="main-wrapper overflow-hidden">
	<header className="main-header w-100">
		<nav className="navbar navbar-expand-lg navbar-dark sticky-header">
			<div className="container d-flex align-items-center justify-content-lg-between position-relative">
				<Link to="/" className="navbar-brand d-flex align-items-center mb-md-0 text-decoration-none">
					<img src="/logo.svg" width="110" alt="Retro Hunters"/>
				</Link>
				<div className="action-btns text-end me-lg-0 d-block d-lg-none">
					
					<a href="https://twitter.com/" rel="me" target="_blank" className="btn btn-link text-decoration-none me-2 social-link">
                        <img src="/images/twitter.svg" alt="Twitter" width="30"/>
					</a>
                    <a href="http://discord.gg/" rel="me" target="_blank" className="btn btn-link text-decoration-none me-2 social-link">
                        <img src="/images/discord.svg" alt="discord" width="30"/>
					</a>
                    <a href="http://discord.gg/" rel="me" target="_blank" className="btn btn-link text-decoration-none me-2 social-link">
                        <img src="/images/3.svg" alt="discord" width="30"/>
					</a>
					
				</div>
				<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="navbar-collapse collapse justify-content-end" id="navbarText">
				<ul className="navbar-nav col-12 col-md-auto justify-content-center main-menu">

					<li className="nav-item">
						<Link  to="/about" className='nav-link'>About</Link>
					</li>
                    <li className="nav-item">
						<Link  to="/roadmap" className="nav-link" >Roadmap</Link>
					</li>
					<li className="nav-item">
						<Link  to="/whitepaper" className="nav-link">Whitepaper</Link>
					</li>
                    <li className="nav-item">
						<Link  to="/account" className="nav-link">Account</Link>
					</li>
					<li className="mob_nav action-btns d-none d-lg-block">
					<a href="https://twitter.com/" rel="me" target="_blank" className="btn btn-link text-decoration-none me-2 social-link">
						<img src="/images/twitter.svg" alt="Twitter" width="30"/>
					</a>
                    <a href="https://discord.com/" rel="me" target="_blank" className="btn btn-link text-decoration-none me-2 social-link">
						<img src="/images/discord.svg" alt="discord" width="30"/>
					</a>
                    <a href="https://twitter.com/" rel="me" target="_blank" className="btn btn-link text-decoration-none me-2 social-link">
						<img src="/images/3.svg" alt="Twitter" width="30"/>
					</a>
					</li>
				</ul>
				
				</div>
					
			</div>		
		</nav>
	</header>
	</div>
     );
}
 
export default Header;