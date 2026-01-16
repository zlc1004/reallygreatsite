'use client';

import { useState, useEffect, useCallback } from 'react';

interface SpawnedTextBox {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

export default function Home() {
  const [spawnedTextBoxes, setSpawnedTextBoxes] = useState<SpawnedTextBox[]>([]);
  const [nextId, setNextId] = useState(0);
  const [randomColors, setRandomColors] = useState<Record<string, string>>({});
  const [flickerState, setFlickerState] = useState(true);

  const updateColors = useCallback(() => {
    const colors: Record<string, string> = {};
    for (let i = 0; i < 50; i++) {
      colors[`color${i}`] = getRandomColor();
      colors[`color${i}dark`] = getRandomColor();
      colors[`color${i}light`] = getRandomColor();
    }
    setRandomColors(colors);
  }, []);

  const toggleFlicker = useCallback(() => {
    setFlickerState(prev => !prev);
  }, []);

  const spawnBox = useCallback(() => {
    const newBox: SpawnedTextBox = {
      id: nextId,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      rotation: Math.random() * 360,
      color: getRandomColor(),
    };
    setNextId(prev => prev + 1);
    setSpawnedTextBoxes(prev => [...prev, newBox]);

    setTimeout(() => {
      setSpawnedTextBoxes(prev => prev.filter(box => box.id !== newBox.id));
    }, 2000);
  }, [nextId]);

  useEffect(() => {
    updateColors();
    const colorInterval = setInterval(updateColors, 50);
    return () => clearInterval(colorInterval);
  }, [updateColors]);

  useEffect(() => {
    const flickerInterval = setInterval(toggleFlicker, 20);
    return () => clearInterval(flickerInterval);
  }, [toggleFlicker]);

  useEffect(() => {
    const interval = setInterval(spawnBox, 100);
    return () => clearInterval(interval);
  }, [spawnBox]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black overflow-hidden relative"
      style={{ 
        opacity: flickerState ? 1 : 0.3,
        background: `linear-gradient(to bottom, ${randomColors['color0']}, ${randomColors['color1']}, ${randomColors['color2']})`
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(44)].map((_, i) => (
          <div 
            key={i} 
            className={`star ${i % 2 === 0 ? 'star-large' : ''}`}
            style={{ 
              left: `${(i * 2.2) % 95 + 1}%`,
              top: `${(i * 2.1) % 90 + 5}%`,
              animationDelay: `${(i * 0.1) % 3}s`,
              animationDuration: `${(i * 0.1) % 2 + 1}s`,
              background: randomColors[`color${i}`],
              opacity: flickerState ? (Math.random() * 0.5 + 0.5) : 0.2,
              boxShadow: `0 0 ${Math.random() * 10}px ${randomColors[`color${i}dark`]}`
            }}
          ></div>
        ))}
      </div>

      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className="flickering-light"
          style={{
            position: 'fixed',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 2,
            top: i < 2 ? '10%' : i < 4 ? '50%' : 'bottom',
            left: i % 2 === 0 ? i < 4 ? '10%' : '5%' : 'right',
            right: i % 2 !== 0 ? i < 4 ? '10%' : '5%' : undefined,
            bottom: i >= 4 ? i < 6 ? '10%' : '5%' : undefined,
            background: `radial-gradient(circle, ${randomColors[`color${i + 10}`]} 0%, transparent 70%)`,
            boxShadow: `0 0 100px ${randomColors[`color${i + 10}dark`]}`,
            opacity: flickerState ? Math.random() * 0.8 + 0.2 : 0.1,
            animation: `flickerLight 0.05s infinite`,
            animationDelay: `${i * 0.01}s`
          }}
        ></div>
      ))}

      {spawnedTextBoxes.map(box => (
        <div 
          key={box.id} 
          className="spawned-spinning-box" 
          style={{ 
            left: `${box.x}%`, 
            top: `${box.y}%`,
            opacity: flickerState ? 1 : 0.3
          }}
        >
          <div 
            className="spawned-box-inner"
            style={{
              background: `linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`,
              border: `3px solid ${getRandomColor()}`,
              boxShadow: `0 0 20px ${getRandomColor()}, 0 0 40px ${getRandomColor()}`
            }}
          >
            <span style={{ color: getRandomColor(), textShadow: `2px 2px 4px ${getRandomColor()}` }}>SPINNING!</span>
          </div>
        </div>
      ))}

      {[...Array(4)].map((_, i) => (
        <div 
          key={i}
          className="spinning-overlay"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${[800, 600, 400, 1000][i]}px`,
            height: `${[800, 600, 400, 1000][i]}px`,
            marginTop: `${-[400, 300, 200, 500][i]}px`,
            marginLeft: `${-[400, 300, 200, 500][i]}px`,
            border: `${[10, 8, 15, 5][i]}px solid`,
            borderColor: randomColors[`color${i + 20}`],
            borderRadius: '50%',
            animation: `spinOverlay${i + 1} ${[2, 1.5, 1, 3][i]}s linear ${i % 2 === 0 ? '' : 'reverse'} infinite`,
            opacity: flickerState ? 0.5 : 0.1,
            pointerEvents: 'none',
            boxShadow: `0 0 50px ${randomColors[`color${i + 20}dark`]}, inset 0 0 50px ${randomColors[`color${i + 20}dark`]}`
          }}
        ></div>
      ))}

      <div 
        className="flashing-bg"
        style={{
          position: 'fixed',
          inset: 0,
          background: randomColors['color25'],
          pointerEvents: 'none',
          zIndex: 1,
          opacity: flickerState ? 0.2 : 0.05
        }}
      ></div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
        <div className="relative z-10 text-center max-w-4xl">
          {[...Array(2)].map((_, i) => (
            <div 
              key={i}
              className="marquee-container mb-8 glitch-effect"
              style={{
                background: `linear-gradient(90deg, ${randomColors['color26']}, ${randomColors['color27']}, ${randomColors['color28']}, ${randomColors['color29']}, ${randomColors['color30']})`,
                animationDirection: i === 1 ? 'reverse' : 'auto',
                opacity: flickerState ? 1 : 0.3
              }}
            >
              <div className={`marquee-text ${i === 1 ? 'marquee-text-alt' : ''}`}>
                {i === 0 ? 
                  '★★★ WELCOME TO THE GREATEST SITE EVER ★★★ THIS IS A REALLY GREAT SITE ★★★ AWESOME CONTENT AHEAD ★★★ YOU ARE WINNER ★★★ KOBOSH APPROVED ★★★' :
                  '★★★ BEST SITE ON THE WEB ★★★ REALLY REALLY GREAT ★★★ TELL EVERYONE ★★★ THIS IS AMAZING ★★★ UNBELIEVABLE ★★★'
                }
              </div>
            </div>
          ))}

          <div 
            className="neon-border-container mb-8 rotate-3d"
            style={{ opacity: flickerState ? 1 : 0.3 }}
          >
            <h1 
              className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text fire-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${randomColors['color31']}, ${randomColors['color32']}, ${randomColors['color33']})`
              }}
            >
              REALLY GREAT SITE
            </h1>
          </div>

          <div 
            className="blinking-text mb-8 mega-shake"
            style={{ opacity: flickerState ? 1 : 0.3 }}
          >
            <p 
              className="text-2xl md:text-4xl font-bold disco-text"
              style={{ color: randomColors['color34'] }}
            >
              *** THIS IS A REALLY GREAT SITE ***
            </p>
          </div>

          <div 
            className="rainbow-text mb-8 spin-text"
            style={{ opacity: flickerState ? 1 : 0.3 }}
          >
            <p 
              className="text-3xl md:text-5xl font-black"
              style={{ color: randomColors['color35'] }}
            >
              THE BEST WEBSITE EVER!!!
            </p>
          </div>

          <div 
            className="rainbow-border mb-8 p-4 bounce-box"
            style={{
              borderColor: randomColors['color36'],
              background: randomColors['color36dark'],
              opacity: flickerState ? 1 : 0.3
            }}
          >
            <p 
              className="text-xl md:text-2xl glitchy-text"
              style={{ color: randomColors['color37'] }}
            >
              🌟 YOU HAVE FOUND THE GREATEST SITE ON THE INTERNET 🌟
            </p>
          </div>

          <div className="grid gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="glow-box mega-pulse"
                style={{
                  borderColor: randomColors[`color${38 + i}`],
                  boxShadow: `0 0 20px ${randomColors[`color${38 + i}dark`]}, 0 0 40px ${randomColors[`color${38 + i}dark`]}`,
                  animationDelay: `${i * 0.2}s`,
                  opacity: flickerState ? 1 : 0.3
                }}
              >
                <p 
                  className="text-lg shake-hard"
                  style={{ color: randomColors[`color${38 + i}light`] }}
                >
                  ✓ This site is REALLY GREAT
                </p>
              </div>
            ))}
          </div>

          <div 
            className="under-construction mb-8 mega-shake"
            style={{
              borderColor: randomColors['color44'],
              opacity: flickerState ? 1 : 0.3
            }}
          >
            <p 
              className="text-2xl font-bold fire-text"
              style={{ color: randomColors['color45'] }}
            >
              🚧 UNDER CONSTRUCTION - BUT STILL REALLY GREAT 🚧
            </p>
          </div>

          {[...Array(3)].map((_, i) => (
            <div 
              key={i}
              className="visitor-counter mb-8 glow-crazy"
              style={{
                borderColor: randomColors[`color${46 + i}`],
                boxShadow: `0 0 30px ${randomColors[`color${46 + i}dark`]}, 0 0 60px ${randomColors[`color${46 + i}dark`]}`,
                animationDelay: `${i * 0.5}s`,
                opacity: flickerState ? 1 : 0.3
              }}
            >
              <p className="text-xl" style={{ color: 'white' }}>
                {['VISITORS: ', 'AWESOME RATING: ', 'GREATNESS LEVEL: '][i]}
                <span 
                  className="font-mono text-3xl number-animate"
                  style={{ color: randomColors[`color${49 + i}`] }}
                >
                  {['1337420', '∞/10', '999+'][i]}
                </span>
              </p>
            </div>
          ))}

          <div 
            className="email-link mb-8 mega-spin"
            style={{
              borderColor: randomColors['color52'],
              background: `linear-gradient(90deg, transparent, ${randomColors['color52']}80, transparent)`,
              opacity: flickerState ? 1 : 0.3
            }}
          >
            <p 
              className="text-lg disco-text"
              style={{ color: randomColors['color53'] }}
            >
              📧 Email us: kobosh@kobosh.com 📧
            </p>
          </div>

          {[...Array(2)].map((_, i) => (
            <div 
              key={i}
              className="footer-marquee mb-4"
              style={{
                background: `linear-gradient(90deg, ${randomColors['color54']}, ${randomColors['color55']}, ${randomColors['color56']})`,
                animationDirection: i === 1 ? 'reverse' : 'auto',
                opacity: flickerState ? 1 : 0.3
              }}
            >
              <div className={`footer-marquee-text ${i === 1 ? 'footer-marquee-text-alt' : ''}`}>
                {i === 0 ? 
                  'THANKS FOR VISITING THIS REALLY GREAT SITE!!! BOOKMARK US NOW!!! TELL YOUR FRIENDS!!! THIS IS THE BEST!!!' :
                  'KOBOSH SAYS THIS IS AWESOME!!! BEST SITE EVER!!! REALLY GREAT!!! AMAZING!!! INCREDIBLE!!!'
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&family=Press+Start+2P&display=swap');

        body {
          font-family: 'Comic Neue', 'Comic Sans MS', cursive;
        }

        .star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: twinkle 0.5s infinite;
        }

        .star-large {
          width: 8px;
          height: 8px;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          25% { opacity: 0.3; transform: scale(1.5) rotate(90deg); }
          50% { opacity: 0.8; transform: scale(0.5) rotate(180deg); }
          75% { opacity: 0.4; transform: scale(1.2) rotate(270deg); }
        }

        .flickering-light {
          animation: flickerLight 0.03s infinite;
        }

        @keyframes flickerLight {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.2; transform: scale(1.3); }
          50% { opacity: 0.9; transform: scale(0.8); }
          75% { opacity: 0.3; transform: scale(1.1); }
        }

        .spawned-spinning-box {
          position: fixed;
          width: 100px;
          height: 100px;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 50;
          animation: spin1000rpm 0.06s linear infinite;
        }

        .spawned-box-inner {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          animation: spawnedFadeOut 2s ease-out forwards;
        }

        @keyframes spin1000rpm {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes spawnedFadeOut {
          0% { opacity: 1; transform: scale(0.5); }
          20% { transform: scale(1.2); }
          50% { opacity: 0.8; }
          100% { opacity: 0; transform: scale(0.3); }
        }

        .spinning-overlay {
          animation: rotateConstant linear infinite;
        }

        @keyframes rotateConstant {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .marquee-container {
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
          animation: rainbowBorder 0.5s linear infinite;
        }

        @keyframes rainbowBorder {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }

        .marquee-text {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          animation: marquee 10s linear infinite;
          white-space: nowrap;
          text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000;
        }

        .marquee-text-alt {
          color: white;
          font-size: 1.3rem;
          font-weight: bold;
          animation: marquee 8s linear infinite reverse;
          white-space: nowrap;
          text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000;
        }

        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        .neon-border-container {
          transform-style: preserve-3d;
        }

        .rotate-3d {
          animation: rotate3D 2s linear infinite;
        }

        @keyframes rotate3D {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          25% { transform: rotateX(15deg) rotateY(15deg); }
          50% { transform: rotateX(0deg) rotateY(0deg); }
          75% { transform: rotateX(-15deg) rotateY(-15deg); }
          100% { transform: rotateX(0deg) rotateY(0deg); }
        }

        .fire-text {
          animation: fire 0.1s infinite;
        }

        @keyframes fire {
          0%, 100% { 
            transform: translateY(0);
          }
          50% { 
            transform: translateY(-5px);
          }
        }

        .blinking-text {
          animation: blink 0.1s infinite;
        }

        @keyframes blink {
          0%, 30% { opacity: 1; transform: scale(1); }
          35% { opacity: 0; transform: scale(1.2); }
          65% { opacity: 0; transform: scale(1.2); }
          70% { opacity: 1; transform: scale(1); }
        }

        .rainbow-text {
          animation: colorCycle 0.1s infinite;
        }

        .spin-text {
          animation: spinText 0.3s infinite;
        }

        @keyframes spinText {
          0% { transform: rotate(-5deg) scale(1); }
          25% { transform: rotate(5deg) scale(1.2); }
          50% { transform: rotate(-5deg) scale(1); }
          75% { transform: rotate(5deg) scale(1.2); }
          100% { transform: rotate(-5deg) scale(1); }
        }

        .rainbow-border {
          border: 6px solid;
          animation: borderPulse 0.2s infinite;
        }

        @keyframes borderPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .bounce-box {
          animation: bounceBox 0.2s ease-in-out infinite;
        }

        @keyframes bounceBox {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .glow-box {
          background: rgba(0, 0, 0, 0.9);
          border: 5px solid;
          padding: 15px;
          border-radius: 15px;
        }

        .mega-pulse {
          animation: megaPulse 0.3s infinite;
        }

        @keyframes megaPulse {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
          }
          50% { 
            transform: scale(1.1) rotate(10deg);
          }
        }

        .shake-hard {
          animation: shakeHard 0.08s infinite;
        }

        @keyframes shakeHard {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-10px) rotate(-8deg); }
          75% { transform: translateX(10px) rotate(8deg); }
        }

        .mega-shake {
          animation: megaShake 0.06s infinite;
        }

        @keyframes megaShake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-15px, -8px) rotate(-8deg); }
          40% { transform: translate(15px, 8px) rotate(8deg); }
          60% { transform: translate(-8px, 15px) rotate(-5deg); }
          80% { transform: translate(8px, -15px) rotate(5deg); }
        }

        .under-construction {
          background: repeating-linear-gradient(45deg, #000, #000 5px, #ffff00 5px, #ffff00 10px);
          padding: 20px;
          border-radius: 10px;
          border: 5px solid;
          animation: shake 0.1s infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-15px) rotate(-5deg); }
          75% { transform: translateX(15px) rotate(5deg); }
        }

        .visitor-counter {
          background: #000;
          border: 5px solid;
          padding: 20px;
          border-radius: 15px;
          font-family: 'Press Start 2P', monospace;
        }

        .glow-crazy {
          animation: glowCrazy 0.15s infinite;
        }

        @keyframes glowCrazy {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .number-animate {
          animation: numberDance 0.2s infinite;
        }

        @keyframes numberDance {
          0%, 100% { transform: scale(1); text-shadow: 0 0 15px currentColor; }
          50% { transform: scale(1.3); text-shadow: 0 0 40px currentColor, 0 0 80px currentColor; }
        }

        .email-link {
          padding: 20px;
          border-radius: 15px;
          border: 3px solid;
        }

        .mega-spin {
          animation: megaSpin 0.5s linear infinite;
        }

        @keyframes megaSpin {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(15deg) scale(1.2); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(-15deg) scale(1.2); }
          100% { transform: rotate(0deg) scale(1); }
        }

        .footer-marquee {
          padding: 15px;
          border-radius: 10px;
          margin-top: 20px;
          animation: footerGlow 0.3s infinite;
        }

        @keyframes footerGlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .footer-marquee-text {
          color: white;
          font-size: 1.3rem;
          font-weight: bold;
          animation: marquee 8s linear infinite;
          white-space: nowrap;
          text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000;
        }

        .footer-marquee-text-alt {
          color: white;
          font-size: 1.2rem;
          font-weight: bold;
          animation: marquee 6s linear infinite reverse;
          white-space: nowrap;
          text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000;
        }

        .glitch-effect {
          animation: glitch 0.15s infinite;
        }

        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-3px, 3px); }
          40% { transform: translate(-3px, -3px); }
          60% { transform: translate(3px, 3px); }
          80% { transform: translate(3px, -3px); }
        }

        .disco-text {
          animation: disco 0.2s infinite;
        }

        @keyframes disco {
          0%, 100% { text-shadow: 0 0 15px currentColor; }
          50% { text-shadow: 0 0 30px currentColor; }
        }

        .glitchy-text {
          animation: glitchy 0.1s infinite;
        }

        @keyframes glitchy {
          0%, 100% { 
            transform: translateX(0);
          }
          25% { 
            transform: translateX(-5px);
          }
          75% { 
            transform: translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}
