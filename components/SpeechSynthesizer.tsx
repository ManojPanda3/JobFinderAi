// components/SpeechSynthesizer.tsx
'use client';

import React, { useRef, useEffect } from 'react';

interface SpeechSynthesizerProps {
  text: string;
  play: boolean;
  onPlayEnd: () => void;
  onPlayStart: () => void;
}

const SpeechSynthesizer: React.FC<SpeechSynthesizerProps> = ({
  text,
  play,
  onPlayEnd,
  onPlayStart
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!text || !play) return;

    // Create utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = 1.0;
    utteranceRef.current.pitch = 1.0;
    utteranceRef.current.volume = 1.0;

    // Set event handlers
    utteranceRef.current.onstart = () => {
      onPlayStart();
    };

    utteranceRef.current.onend = () => {
      onPlayEnd();
    };

    utteranceRef.current.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      onPlayEnd();
    };

    // Start speaking
    window.speechSynthesis.speak(utteranceRef.current);

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, play, onPlayEnd, onPlayStart]);

  return <audio ref={audioRef} className="hidden" />;
};

export default SpeechSynthesizer;
