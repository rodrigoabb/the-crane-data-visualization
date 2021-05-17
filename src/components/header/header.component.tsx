import React from 'react';
import { Link } from 'react-router-dom';

import './header.component.scss';

const Header: React.FC = () => {
  return (
    <div className="header">
      <header className="">
        <Link to={`/`} style={{ textDecoration: 'none', color: 'inherit'}}>
          <div className="logo" >
            <h1>
              theCrane
            </h1>
          </div>
        </Link>

      </header>

    </div>
  );
};

export default Header;
