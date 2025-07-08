import React, { useState, useRef, useEffect } from 'react';
import {Link} from "react-router-dom";
import '../styles/Userbox.css';

function Userbox() {

return (
            <div className="user"><Link to={"/register"}>
            <div className="user-info">
              <span>Guest</span>
              <small>Welcome!</small>
            </div>
            <div className="profile-picture"></div>
           </Link>
          </div>
)
}

export default Userbox