"use client"

import "./preloader.css"

export default function Preloader() {
  return (
    <div className="preloader-overlay">
      <div className="preloader-content">
        <img src="/loader.gif" alt="Loading..." className="preloader-gif" />
        <p className="preloader-text">Accessing Cyblack Servers</p>
      </div>
    </div>
  )
}
