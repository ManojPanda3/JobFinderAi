'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SpeechProcessorProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

const SpeechProcessor: React.FC<SpeechProcessorProps> = ({ onTranscript, isProcessing }) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognizerRef = useRef<any>(null);

  // Load Vosk model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const Vosk = (window as any).Vosk; // Access Vosk from global scope
        if (!Vosk) {
          throw new Error('Vosk library not loaded. Ensure vosk.js is included.');
        }
        Vosk.setLogLevel(0); // Disable logging
        const model = await Vosk.createModel('/models/vosk-model-small-en-us');
        const recognizer = new model.KaldiRecognizer(16000); // 16kHz sample rate
        recognizerRef.current = recognizer;
        setModelLoaded(true);
      } catch (err) {
        setError(`Failed to load model: ${err.message}`);
      }
    };
    loadModel();
  }, []);

  // Start listening: capture audio and process with Vosk
  const startListening = async () => {
    if (!modelLoaded || isListening || isProcessing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Data = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          int16Data[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32767));
        }
        if (recognizerRef.current.acceptWaveform(int16Data)) {
          const result = recognizerRef.current.result();
          if (result.text) {
            onTranscript(result.text);
          }
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination); // Required for processing
      setIsListening(true);
      setError(null);
    } catch (err) {
      setError(`Failed to start listening: ${err.message}`);
    }
  };

  // Stop listening: clean up audio resources and get final result
  const stopListening = () => {
    if (!isListening) return;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (recognizerRef.current) {
      const finalResult = recognizerRef.current.finalResult();
      if (finalResult.text) {
        onTranscript(finalResult.text);
      }
    }
    setIsListening(false);
  };

  // Cleanup on unmount if listening
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening]);

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing || !modelLoaded}
        className={`px-6 py-3 rounded-md font-medium ${isListening
          ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
          } ${isProcessing || !modelLoaded ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
      {!modelLoaded && <div className="mt-2">Loading speech recognition model...</div>}
      {error && <div className="text-destructive mt-2">{error}</div>}
    </div>
  );
};

export default SpeechProcessor;
