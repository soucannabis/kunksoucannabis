import React from 'react';

const NavbarComDoisMenus = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      
      <div className="container-fluid">

        <div className="collapse navbar-collapse" id="navbarNav1">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Menu 1</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Menu 2</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Menu 3</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComDoisMenus;
