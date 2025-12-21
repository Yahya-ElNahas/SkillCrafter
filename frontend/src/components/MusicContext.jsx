import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import barbarossaSoundUrl from "../assets/music/barbarossa.mp3";
import greatPatrioticWarSoundUrl from "../assets/music/great_patriotic_war.mp3";
import mightOfSovietUnionSoundUrl from "../assets/music/might_of_the_soviet_union.mp3";
import retributionSoundUrl from "../assets/music/retribution.mp3";

const musicTracks = [
  barbarossaSoundUrl,
  greatPatrioticWarSoundUrl,
  mightOfSovietUnionSoundUrl,
  retributionSoundUrl
];

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const backgroundAudioRef = useRef(null);
  const [musicPaused, setMusicPaused] = useState(false);
  const location = useLocation();

  const playTrack = (trackUrl) => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.src = trackUrl;
      backgroundAudioRef.current.load();
      const shouldPlay = !musicPaused && ['/app', '/achievements', '/leaderboard'].includes(location.pathname);
      if (shouldPlay) {
        backgroundAudioRef.current.play().catch(() => {});
      }
    }
  };

  const playNextTrack = () => {
    const randomIndex = Math.floor(Math.random() * musicTracks.length);
    const nextTrack = musicTracks[randomIndex];
    playTrack(nextTrack);
  };

  // Start background music when entering the game
  useEffect(() => {
    const token = localStorage.getItem('token');
    const paused = localStorage.getItem('musicPaused') === 'true';
    setMusicPaused(paused);
    if (token && !backgroundAudioRef.current && ['/app', '/achievements', '/leaderboard'].includes(location.pathname)) {
      startMusic();
    }

    const handleTokenSet = () => {
      const token = localStorage.getItem('token');
      const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
      console.log('handleTokenSet called, token:', !!token, 'justSignedUp:', justSignedUp, 'pathname:', location.pathname);
      if (token && ['/app', '/achievements', '/leaderboard'].includes(location.pathname)) {
        if (!backgroundAudioRef.current) {
          startMusic();
        } else if (justSignedUp) {
          // If just signed up and music is already playing, restart with barbarossa
          playTrack(barbarossaSoundUrl);
          localStorage.removeItem('justSignedUp');
        }
      }
    };

    // Check if we just signed up and need to play barbarossa
    const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
    if (justSignedUp && token && backgroundAudioRef.current && ['/app', '/achievements', '/leaderboard'].includes(location.pathname)) {
      playTrack(barbarossaSoundUrl);
      localStorage.removeItem('justSignedUp');
    }

    window.addEventListener('tokenSet', handleTokenSet);
    return () => window.removeEventListener('tokenSet', handleTokenSet);
  }, [location.pathname]);

  const startMusic = () => {
    const audio = new Audio();
    audio.volume = 0.1;
    audio.onended = playNextTrack;
    backgroundAudioRef.current = audio;
    const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
    if (justSignedUp) {
      playTrack(barbarossaSoundUrl);
      localStorage.removeItem('justSignedUp');
    } else {
      playNextTrack(); // Start with random track
    }
  };

  // Handle music pause/play
  useEffect(() => {
    if (backgroundAudioRef.current) {
      const shouldPause = musicPaused || !['/app', '/achievements', '/leaderboard'].includes(location.pathname);
      if (shouldPause) {
        backgroundAudioRef.current.pause();
      } else {
        backgroundAudioRef.current.play().catch(() => {});
      }
    }
    localStorage.setItem('musicPaused', musicPaused);
  }, [musicPaused, location.pathname]);

  // ensure audio is stopped on unmount
  useEffect(() => {
    return () => {
      try {
        if (backgroundAudioRef.current) {
          backgroundAudioRef.current.pause();
          backgroundAudioRef.current.currentTime = 0;
          backgroundAudioRef.current = null;
        }
      } catch (_) {}
    };
  }, []);

  const toggleMusic = () => {
    setMusicPaused(!musicPaused);
  };

  const stopMusic = () => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }
    setMusicPaused(true);
  };

  return (
    <MusicContext.Provider value={{ musicPaused, toggleMusic, stopMusic }}>
      {children}
    </MusicContext.Provider>
  );
};