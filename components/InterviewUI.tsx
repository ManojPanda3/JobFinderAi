// components/InterviewUI.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import AudioVisualizer from './AudioVisualizer';
import SpeechProcessor from './SpeechProcessor';
import SpeechSynthesizer from './SpeechSynthesizer';
import { searchJobs } from '@/lib/data';
import { LoaderIcon } from 'lucide-react';

interface InterviewUIProps {
  jobId: string;
}

const InterviewUI: React.FC<InterviewUIProps> = ({ jobId }) => {
  const [userMessage, setUserMessage] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [conversation, setConversation] = useState<Array<{ role: string, message: string }>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!jobId) return;
    searchJobs("", jobId)
      .then((job) => {
        if (job.length) {
          setJob(job[0])
          setLoading(false)
        }
      })
  }, [jobId])
  useEffect(() => {
    if (!job) return
    handleSendMessage(`Hello, I'm your AI interviewer for the ${job.title} position. Let's begin our conversation. Please introduce yourself.`, 'ai');
  }, [job]);



  // Get microphone permissions when recording starts
  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          setMediaStream(stream);
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
          setIsRecording(false);
        });
    } else {
      // Clean up stream when not recording
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    }
  }, [isRecording]);

  // Handle user transcript
  const handleTranscript = (text: string) => {
    setUserMessage(text);
    handleSendMessage(text, 'user');
  };

  // Send message to API
  const handleSendMessage = async (message: string, role: 'user' | 'ai') => {
    // Add to conversation
    setConversation(prev => [...prev, { role, message }]);

    // If it's a user message, process it
    if (role === 'user') {
      setIsProcessing(true);

      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: message }),
        });

        const data = await response.json();

        if (data.status === 200) {
          setAiMessage(data.message);
          // Add AI response to conversation
          setConversation(prev => [...prev, { role: 'ai', message: data.message }]);
          // Trigger speech synthesis
          setShouldPlay(true);
        } else {
          console.error('Error from AI API:', data.message);
          setAiMessage('Sorry, I encountered an error. Please try again.');
          setConversation(prev => [...prev, {
            role: 'ai',
            message: 'Sorry, I encountered an error. Please try again.'
          }]);
        }
      } catch (error) {
        console.error('Error sending message to AI:', error);
        setAiMessage('Sorry, I encountered an error. Please try again.');
        setConversation(prev => [...prev, {
          role: 'ai',
          message: 'Sorry, I encountered an error. Please try again.'
        }]);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Handle speech synthesis playback
  const handlePlayStart = () => {
    setIsPlaying(true);
  };

  const handlePlayEnd = () => {
    setIsPlaying(false);
    setShouldPlay(false);
  };
  if (loading || job === null) return <LoaderIcon className="animate-spin -translate-1/2 absolute top-1/2 left-1/2 -translate-1/2" />

  return (
    <div className="flex flex-col items-center">
      {/* Audio visualization sphere */}
      <div className={`relative w-64 h-64 mb-8 flex items-center justify-center rounded-full ${isRecording
        ? 'bg-accent'
        : isPlaying
          ? 'bg-primary/10'
          : 'bg-card'
        } border border-border shadow-lg`}>
        <AudioVisualizer
          isRecording={isRecording}
          isPlaying={isPlaying}
          audioStream={mediaStream}
          audioElement={audioElementRef.current}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-16 h-16 rounded-full ${isRecording
            ? 'bg-destructive animate-pulse'
            : isPlaying
              ? 'bg-primary animate-pulse'
              : 'bg-muted'
            }`}></div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="text-center mb-4">
        {isProcessing && <p className="text-muted-foreground">Processing your response...</p>}
        {isRecording && <p className="text-destructive">Listening...</p>}
        {isPlaying && <p className="text-primary">Speaking...</p>}
        {!isProcessing && !isRecording && !isPlaying &&
          <p className="text-muted-foreground">Ready for conversation</p>
        }
      </div>

      {/* Speech controls */}
      <SpeechProcessor
        onTranscript={handleTranscript}
        isProcessing={isProcessing || isPlaying}
      />

      {/* Speech synthesizer (hidden) */}
      <SpeechSynthesizer
        text={aiMessage}
        play={shouldPlay}
        onPlayEnd={handlePlayEnd}
        onPlayStart={handlePlayStart}
      />

      {/* Conversation history */}
      <div className="mt-8 w-full max-w-2xl border border-border rounded-lg p-4 bg-card text-card-foreground h-96 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Conversation</h2>
        {conversation.map((item, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg ${item.role === 'user'
              ? 'bg-accent/20 text-accent-foreground ml-8'
              : 'bg-muted text-muted-foreground mr-8'
              }`}
          >
            <p className="font-semibold mb-1">
              {item.role === 'user' ? 'You' : 'AI Interviewer'}:
            </p>
            <p>{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewUI;
