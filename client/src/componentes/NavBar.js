import React from 'react';
import { Link } from 'react-router-dom';

function MenuToggle() {
    var wrapper = document.getElementById("wrapper");
    wrapper.classList.toggle("toggled");
    return false;
}

function NavBarTopo({logout}) {
    return (
        <nav className="navbar navbar-expand-lg bg-dark navbar">
            <button id="menu-toggle" onClick={MenuToggle}>&#9776; </button>
            <div className="ml-auto mt-2 mt-lg-0">
                <Link to="/" onClick={e => logout(e)}>Leave <i className="fa fa-sign-out" aria-hidden="true"></i></Link>
            </div>
        </nav>
    );
}

export default NavBarTopo;