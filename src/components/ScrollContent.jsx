import React, { useState } from 'react'

const GIF_LIST = [
  '/bongo-cat-transparent.gif',
  '/cute-anime-girl.gif',
  '/fly-kiss-hearts.gif',
  '/meowbah-meowbahh.gif',
  '/vtuber-nuwa-ceres.gif'
]

export default function ScrollContent() {
  // Initial GIF is bongo-cat-transparent.gif
  const [currentGif, setCurrentGif] = useState('/bongo-cat-transparent.gif')

  const handleTap = () => {
    // 1. Select a random new GIF (different from the current one to guarantee a change)
    const otherGifs = GIF_LIST.filter(gif => gif !== currentGif)
    const randomGif = otherGifs[Math.floor(Math.random() * otherGifs.length)]
    setCurrentGif(randomGif)

    // 2. Play elastic bounce & wobble animation on the entire GIF button container
    import('gsap').then(({ default: gsap }) => {
      gsap.fromTo('#special-tap-btn', 
        { scale: 0.85, rotation: -8 }, 
        { scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1.5, 0.3)' }
      )
    })
  }

  return (
    <div className="html-overlay">
      {/* ===== Section 1: Hero ===== */}
      <section className="scroll-section section-hero">
        <div className="hero-title">
          <h1>Nguyễn Huyền</h1>
        </div>
        
        {/* GIF acts as the button itself, with text below */}
        <div className="hero-tap-container">
          <button 
            id="special-tap-btn" 
            className="gif-button" 
            onClick={handleTap}
          >
            <div className="gif-wrapper">
              <img 
                src={currentGif} 
                alt="Lovely GIF"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
            <span className="tap-me-text">Tap Me! 💖✨</span>
          </button>
        </div>
      </section>

      {/* ===== Section 2: Middle ===== */}
      <section className="scroll-section section-middle">
        <div id="middle-content" className="middle-content">
          <div className="middle-hearts">💎</div>
          <h2>Nguyễn Huyền</h2>
          <div className="middle-line"></div>
        </div>
      </section>

      {/* ===== Section 3: Final ===== */}
      <section className="scroll-section section-final">
        <div id="final-content" className="final-content">
          <h2>Nguyễn Huyền</h2>
          <div className="final-hearts">💖 💗 💝 💖</div>
        </div>
      </section>
    </div>
  )
}
