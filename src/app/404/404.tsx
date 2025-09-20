import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import './404.css';

export default function Custom404() {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');
  const [typedUrl, setTypedUrl] = useState('');
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Get the current URL
    const url = window.location.pathname + window.location.search;
    setCurrentUrl(url);
  }, []);

  useEffect(() => {
    if (currentUrl) {
      // Start typing animation
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < currentUrl.length) {
          setTypedUrl(currentUrl.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          // Show error animation after typing is complete
          setTimeout(() => setShowError(true), 500);
          setTimeout(() => setShowMessage(true), 1000);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [currentUrl]);

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-header">
          <h1 className="error-code">
            4<span className="bounce-1">0</span><span className="bounce-2">4</span>
          </h1>
          <div className="glitch-text">PAGE NOT FOUND</div>
        </div>

        <div className="url-display">
          <span className="url-label">Requested URL:</span>
          <div className="url-field">
            <span className="typed-url">{typedUrl}</span>
            <span className="cursor">|</span>
          </div>
        </div>

        {showError && (
          <div className="error-animation">
            <div className="error-icon">⚠️</div>
            <div className="error-bars">
              <div className="error-bar"></div>
              <div className="error-bar"></div>
              <div className="error-bar"></div>
            </div>
          </div>
        )}

        {showMessage && (
          <div className="error-message fade-in">
            <p>
              Oh, um, I don't think the page you're looking for is accessible on this server. 
              Might be a broken link or maybe you typed something wrong.
            </p>
          </div>
        )}

        <div className="action-buttons">
          <button onClick={handleGoHome} className="home-button">
            <span>Take Me Home</span>
            <div className="button-glow"></div>
          </button>
        </div>

        <div className="background-animation">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>
      </div>
    </div>
  );
}