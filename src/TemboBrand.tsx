/**
 * TEMBO PAGE — Brand Logo Component
 *
 * Renders the new, more dynamic Tembo Page logo from src/assets/logo.png.
 */

import React from 'react';
import logoImg from './assets/logo.png';

interface TemboBrandProps {
  /** Size of the brand icon in pixels */
  iconSize?: number;
  /** Show the wordmark text next to the icon */
  showWordmark?: boolean;
  /** Show only the icon, no text */
  iconOnly?: boolean;
  /** Custom class name */
  className?: string;
}

export function TemboBrand({
  iconSize = 64, // Increase default size
  showWordmark = true,
  iconOnly = false,
  className = '',
}: TemboBrandProps) {
  if (iconOnly) {
    // Clean outline of the elephant head (uncropped, no circular border mask)
    return (
      <div 
        className={`${className}`} 
        style={{
          width: iconSize,
          height: iconSize,
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <img
          src={`${logoImg}?v=2`}
          alt="Tembo Elephant Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            // Scale up and focus on the top 36% of the transparent logo, 
            // hiding the integrated text when icon-only is requested.
            transform: 'scale(1.52)',
            transformOrigin: '50% 36%',
            maxWidth: 'none',
          }}
        />
      </div>
    );
  }

  // Render the full transparent logo exactly as designed (no circular background, no text truncation)
  return (
    <div 
      className={`flex items-center justify-center ${className}`} 
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <img
        src={`${logoImg}?v=2`}
        alt="Tembo Page Logo"
        style={{
          height: iconSize, // Height scales cleanly
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

export default TemboBrand;
