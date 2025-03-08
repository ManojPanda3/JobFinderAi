'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  isRecording: boolean;
  isPlaying: boolean;
  audioStream?: MediaStream | null;
  audioElement?: HTMLAudioElement | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  isPlaying,
  audioStream,
  audioElement
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (!audioContext) {
      const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(newAudioContext);

      const newAnalyser = newAudioContext.createAnalyser();
      newAnalyser.fftSize = 256;
      setAnalyser(newAnalyser);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioContext]);

  useEffect(() => {
    if (!audioContext || !analyser || !canvasRef.current) return;

    // Connect to audio source based on recording or playback state
    let source: MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null = null;

    if (isRecording && audioStream) {
      source = audioContext.createMediaStreamSource(audioStream);
      source.connect(analyser);
    } else if (isPlaying && audioElement) {
      source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }

    // Only draw if we have a valid source
    if (source) {
      drawVisualizer();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      // Clear canvas when not active
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Use theme colors
        drawCircle(ctx, canvas.width / 2, canvas.height / 2, 50, 'hsl(var(--muted))');
      }
    }

    return () => {
      if (source && 'disconnect' in source) {
        source.disconnect();
      }
    };
  }, [isRecording, isPlaying, audioStream, audioElement, audioContext, analyser]);

  const drawVisualizer = () => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate center and radius
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 50;

      // Draw base circle - with theme colors
      const baseColor = isRecording
        ? 'hsl(var(--accent))'
        : isPlaying
          ? 'hsl(var(--primary))'
          : 'hsl(var(--muted))';

      drawCircle(ctx, centerX, centerY, radius, baseColor);

      // Draw audio visualization bars around the circle
      const barCount = 64; // Reduce for better performance
      const barWidth = 3;

      for (let i = 0; i < barCount; i++) {
        // Use a subset of the frequency data
        const dataIndex = Math.floor(i * (bufferLength / barCount));
        const value = dataArray[dataIndex] / 255;

        // Calculate angle for this bar
        const angle = (i / barCount) * Math.PI * 2;

        // Calculate bar height based on audio data (scale it for better visual)
        const minHeight = 10;
        const barHeight = minHeight + value * 50;

        // Calculate start and end points
        const startX = centerX + Math.cos(angle) * radius;
        const startY = centerY + Math.sin(angle) * radius;
        const endX = centerX + Math.cos(angle) * (radius + barHeight);
        const endY = centerY + Math.sin(angle) * (radius + barHeight);

        // Draw the line - Using theme colors
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);

        // Set color based on recording/playing state
        if (isRecording) {
          // Red spectrum for recording - use destructive theme color
          ctx.strokeStyle = `hsla(var(--destructive), ${value * 100}%)`;
        } else if (isPlaying) {
          // Blue spectrum for playback - use primary theme color
          ctx.strokeStyle = `hsla(var(--primary), ${value * 100}%)`;
        } else {
          // Grey spectrum for inactive - use muted theme color
          ctx.strokeStyle = `hsla(var(--muted-foreground), ${value * 100}%)`;
        }

        ctx.lineWidth = barWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    };

    draw();
  };

  // Helper function to draw a circle
  const drawCircle = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string
  ) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="rounded-full"
    />
  );
};

export default AudioVisualizer;
