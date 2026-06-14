import React from 'react'
import { Scroll } from '@react-three/drei'

export default function ScrollContent() {
  return (
    <Scroll html style={{ width: '100%' }}>
      {/* ===== Section 1: Hero ===== */}
      <section className="scroll-section section-hero">
        <div className="hero-title">
          <h1>Nguyễn Huyền</h1>
        </div>
        <div className="scroll-indicator">
          <p>Scroll to explore</p>
          <span className="scroll-arrow">💖</span>
        </div>
      </section>

      {/* ===== Section 2: Middle — name fades in large ===== */}
      <section className="scroll-section section-middle">
        <div className="middle-content">
          <div className="middle-hearts">💎</div>
          <h2>Nguyễn Huyền</h2>
          <div className="middle-line"></div>
        </div>
      </section>

      {/* ===== Section 3: Final ===== */}
      <section className="scroll-section section-final">
        <div className="final-content">
          <h2>Nguyễn Huyền</h2>
          <div className="final-hearts">💖 💗 💝 💖</div>
        </div>
      </section>
    </Scroll>
  )
}
