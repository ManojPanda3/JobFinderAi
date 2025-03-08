'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SpeechProcessorProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

const SpeechProcessor: React.FC<SpeechProcessorProps> = ({ onTranscript, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              const transcript = event.results[i][0].transcript.trim();
              if (transcript) {
                onTranscript(transcript);
              }
            }
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          const errorMessage = event.error === 'network'
            ? 'Network error: Please check your internet connection and try again.'
            : `Speech recognition error: ${event.error}`;
          setError(errorMessage);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            recognitionRef.current.start();
          }
        };
      } else {
        console.error('Speech recognition not supported');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  useEffect(() => {
    if (isProcessing && isListening) {
      stopListening();
    }
  }, [isProcessing]);

  const startListening = () => {
    if (recognitionRef.current && !isListening && !isProcessing) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (error) {
        console.error('Speech recognition start error:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        className={`px-6 py-3 rounded-md font-medium ${isListening
          ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      {error && <div className="text-destructive mt-2">{error}</div>}
    </div>
  );
};

export default SpeechProcessor;
