import { Link } from 'react-router-dom';
import React from 'react';

import Sidebar from './Sidebar';

interface NavbarProps {
  toggleSideBar: () => void;
  displaySidebar: boolean;
  visibilityData: any;
  urlData: any;
  data: any;
  regionInput: any;
  pestleInput: any;
  sectorInput: any;
  topicInput: any;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <div>
      <nav>
        <div className="navbar">
          <div className="navbar-left items-center">
            <i
              className="pi pi-bars text-white mr-6"
              onClick={props.toggleSideBar}
            ></i>
            <Link to="/">
              <h6>DashBoard</h6>
            </Link>
          </div>
        </div>
      </nav>
      {props.displaySidebar === true ? (
        <Sidebar
          visibilityData={props.visibilityData}
          urlData={props.urlData}
          data={props.data}
          regionInput={props.regionInput}
          pestleInput={props.pestleInput}
          sectorInput={props.sectorInput}
          topicInput={props.topicInput}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Navbar;
