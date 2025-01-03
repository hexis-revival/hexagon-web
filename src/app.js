/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from 'react';
import "./app.css";

const HomePage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);

  // Grid configuration
  const ACTIVE_ROWS = 40;
  const ACTIVE_COLS = 165;
  const FLOOR_ROWS = 20;
  const SQUARE_SIZE = 25;
  const SMOOTHING_FACTOR = 0.8;

  // Rotation and zoom goal refs
  const rotationGoalRef = useRef(null);
  const zoomGoalRef = useRef(null);
  const rotationRef = useRef(0);
  const zoomFactorRef = useRef(1);

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

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    analyserRef.current.smoothingTimeConstant = SMOOTHING_FACTOR;
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      draw();
    }
  }, [canvasRef]);  

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      
      const url = URL.createObjectURL(file);
      setAudioFile(url);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      audioRef.current.play();
      draw();
    }
    setIsPlaying(!isPlaying);
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
  
    const totalWidth = ACTIVE_COLS * SQUARE_SIZE;
    canvas.width = totalWidth;
    canvas.height = (ACTIVE_ROWS + FLOOR_ROWS) * SQUARE_SIZE;
  
    const rotationSpeed = 0.0003;
    const zoomSpeed = 0.0001;   
    
    const drawFrame = () => {
      animationRef.current = requestAnimationFrame(drawFrame);
      analyserRef.current.getByteFrequencyData(dataArray);
  
      ctx.fillStyle = '#274f7b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      if (rotationGoalRef.current === null) {
        rotationGoalRef.current = (Math.random() - 0.5) * Math.PI / 4;
      }
      if (zoomGoalRef.current === null) {
        zoomGoalRef.current = 1 + (Math.random() - 0.5) * 0.5;
      }
  
      if (Math.abs(rotationRef.current - rotationGoalRef.current) < 0.1) {
        rotationGoalRef.current = (Math.random() - 0.5) * Math.PI / 4;
      } else {
        rotationRef.current += Math.sign(rotationGoalRef.current - rotationRef.current) * rotationSpeed;
      }
  
      if (Math.abs(zoomFactorRef.current - zoomGoalRef.current) < 0.001) {
        zoomGoalRef.current = 1 + (Math.random() - 0.5) * 0.5;
      } else {
        zoomFactorRef.current += Math.sign(zoomGoalRef.current - zoomFactorRef.current) * zoomSpeed;
      }
  
      ctx.save();
  
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoomFactorRef.current, zoomFactorRef.current);
      ctx.rotate(rotationRef.current / 4);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
      const verticalOffset = 100;
      ctx.translate(0, verticalOffset);

      const floorCols = Math.ceil(canvas.width / SQUARE_SIZE);
      const visualizerOffset = Math.floor((floorCols - ACTIVE_COLS) / 2); 

      for (let col = 0; col < ACTIVE_COLS; col++) {
        const freqIndex = Math.floor(col * (dataArray.length / ACTIVE_COLS));
        let frequencyValue = dataArray[freqIndex];
        frequencyValue = Math.pow(frequencyValue / 255, 1.5) * 255;
        const litSquares = Math.floor((frequencyValue / 255) * ACTIVE_ROWS);
        
        const x = (col + visualizerOffset) * SQUARE_SIZE + 2; 
        
        for (let row = 0; row < ACTIVE_ROWS; row++) {
          const y = (ACTIVE_ROWS - row - 1) * SQUARE_SIZE + 2;
          
          if (row < litSquares) {
            ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
            ctx.fillRect(x, y, SQUARE_SIZE - 4, SQUARE_SIZE - 4);
          }
        }
      }

      for (let col = 0; col < floorCols; col++) {
        for (let row = 0; row < FLOOR_ROWS; row++) {
          const x = col * SQUARE_SIZE + 2;
          const y = ACTIVE_ROWS * SQUARE_SIZE + row * SQUARE_SIZE + 2;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(x, y, SQUARE_SIZE - 4, SQUARE_SIZE - 4);
        }
      }
  
      ctx.restore();
    };
  
    drawFrame();
  };

  return (
    <div className="app">
      {/* Background Canvas :D*/}
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      {/* Page Content */}
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
              <h1>Why play hexis??</h1>
              <p>It's a very game made by lord dienay</p>
            </div>
          </div>
          <div className="content-bottom">
            <div className="flex flex-col items-center space-y-4 p-4">
              <div className="space-y-4">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                  onClick={togglePlay}
                  disabled={!audioFile}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
              </div>

              <audio ref={audioRef} loop />
            </div>
          </div>
        </div>
      </div>

      <div className="nav-container">
        <div className="nav-underline"></div>
        <ul>
          <li>
            <a href="#" className="nav-item selected">Home</a>
          </li>
          <li>
            <a href="#" className="nav-item">Beatmaps</a>
          </li>
          <li>
            <a href="#" className="nav-item">Rankings</a>
          </li>
          <li>
            <a href="#" className="nav-item">Forums</a>
          </li>
        </ul>
      </div>
      <script src="script.js"></script>
    </div>
  );
};

export default HomePage;