import React from "react";
// import { WALLPAPER_URL } from '../constants';
const WALLPAPER_URL =
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop";

interface BackgroundProps {
  isLoaded: boolean;
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ isLoaded, children }) => {
  return (
    <div
      className={`relative w-screen h-screen bg-cover bg-center overflow-hidden transition-opacity duration-1000 ease-in-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
      style={{ backgroundImage: `url(${WALLPAPER_URL})` }}
    >
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {children}
    </div>
  );
};

export default Background;
