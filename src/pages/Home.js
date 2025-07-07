import React from 'react'
import Navbar from '../components/Navbar';
import Visualizer from '../components/Visualizer';
function Home() {
  
  return (
    <div>
        <Navbar />
         <Visualizer />
 <div className="main">
        <div className="main-top">
          <div className="logo-container">
            <div className="pulse-container">
              <div className="rotate-div">
                <img src="/logo.svg" alt="Logo" className="logo-image" />
              </div>
            </div>
            <img src="/logo-text.png" alt="Text" className="logo-text" />
          </div>
          <div className="user">
            <div className="user-info">
              <span>Guest</span>
              <small>Welcome!</small>
            </div>
            <div className="profile-picture"></div>
          </div>
        </div>

        <div className="main-bottom">
          <div className="content">
            <div className="main-text">
              <h1>It's a game.. I think</h1>
              <p>I can't believe it's not butter...</p>
            </div>
            <a className="download-button">Totally legit download</a>
          </div>

          <div className="content-top">
            <div className="why-video">
              <iframe
                title="Why play hexis video"
                src="https://www.youtube.com/embed/hYLbXZ-8gx8"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="why-content">
              <h1>What is hexis?</h1>
              <p>
                Hexis was a free-to-play rhythm game developed by Daniel (Dienay), drawing inspiration from both osu! and the Nintendo DS game Elite Beat Agents.
                The project was discontinued indefinitely in 2017, which leads us to the creation of this revival project.
              </p>
            </div>
          </div>
      
        </div>
      </div>

    </div>
  )
}

export default Home
