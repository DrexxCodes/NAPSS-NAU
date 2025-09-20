"use client"

import Image from "next/image"
import "./preloader.css"

export default function Preloader() {
  return (
    <div className="preloader-overlay">
      <div className="preloader-content">
        <Image
          src="/loader.gif"
          alt="Loading..."
          width={80}   // adjust width
          height={80}  // adjust height
          priority     // ensures it loads immediately
          className="preloader-gif"
        />
        <p className="preloader-text">Accessing Cyblack Servers</p>
      </div>
    </div>
  )
}
