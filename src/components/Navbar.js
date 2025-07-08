import React, { useState, useRef, useEffect } from 'react';
import '../styles/Navbar.css';
import {Link} from "react-router-dom";


import Userbox from '../components/Userbox';
function Navbar() {

useEffect(() => {
    const navItems = document.querySelectorAll('.nav-item');
    const underline = document.querySelector('.nav-underline');
    const navbar = document.querySelector('.nav-container');

    function updateUnderlinePosition(el) {
      const elRect = el.getBoundingClientRect();
      const navbarRect = navbar.getBoundingClientRect();
      underline.style.width = `${elRect.width}px`;
      underline.style.left = `${elRect.left - navbarRect.left}px`;
    }

    navItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        updateUnderlinePosition(item);
        underline.style.opacity = 1;
      });
    });

    navbar?.addEventListener('mouseleave', () => {
      underline.style.opacity = 0;
    });

    const selectedItem = document.querySelector('.nav-item.selected');
    if (selectedItem) {
      updateUnderlinePosition(selectedItem);
      underline.style.opacity = 1;
    }

    return () => {
      navItems.forEach((item) => {
        item.removeEventListener('mouseenter', () => updateUnderlinePosition(item));
      });
      navbar?.removeEventListener('mouseleave', () => {
        underline.style.opacity = 0;
      });
    };
  }, []);
  return (
    <div className="nav-container">
        <div className="nav-underline"></div>
        <ul>
          <li>
            <a href="#" className="nav-item selected"><Link to={"/home"}>Home</Link></a>
          </li>
          <li>
            <a href="#" className="nav-item"><Link to={"/beatmaps"}>Beatmaps</Link></a>
          </li>
          <li>
            <a href="Rankings" className="nav-item"><Link to={"/rankings"}>Rankings</Link></a>
          </li>
          <li>
            <a href="#" className="nav-item"><Link to={"/forums"}>Forums</Link></a>
          </li>
        </ul>

          <Userbox />
      </div>

  )
}

export default Navbar
