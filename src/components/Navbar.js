import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './Navbar.css';


class Navbar extends Component {

  render() {
    return (
      <nav className="navbar navbar-dark bg-dark p-0">

        <h4 className="nav-header text-success">
        Blockchain File Repository
        </h4>
        <ul className="navbar-nav px-3">
          <li>
            <small id="account">
              <a target="_blank"
                 alt=""
                 className="text-white"
                 rel="noopener noreferrer"
                 href={"https://etherscan.io/address/" + this.props.account}>
                Account ID: {this.props.account}
              </a>
            </small>
            { this.props.account
              ? <img
                  alt=""
                  className='ml-2'
                  width='30'
                  height='30'
                  src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                />
              : <span></span>
            }
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
