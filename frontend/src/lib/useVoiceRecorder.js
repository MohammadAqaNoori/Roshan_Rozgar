/**
 * useVoiceRecorder — MediaRecorder hook for voice messages and onboarding.
 *
 * Usage:
 *   const { recording, start, stop, audioBlob, mimeType, duration, reset } = useVoiceRecorder();
 *
 * - start()      → begins recording (requests mic permission if needed)
 * - stop()       → stops recording, sets audioBlob
 * - audioBlob    → Blob ready to POST to backend (or null while recording/idle)
 * - mimeType     → 'audio/webm' | 'audio/ogg' | 'audio/mp4' (browser-dependent)
 * - duration     → recorded seconds (string like "0:12")
 * - error        → permission denied or unsupported message, or null
 * - recording    → true while mic is active
 * - reset()      → clears blob/duration/error to start fresh
 */
import { useState, useRef, useCallback } from 'react';

function preferredMimeType() {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp4',
  ];
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return '';
}

export function useVoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mimeType,  setMimeType]  = useState('audio/webm');
  const [duration,  setDuration]  = useState('0:00');
  const [error,     setError]     = useState(null);

  const mediaRef    = useRef(null);  // MediaRecorder instance
  const chunksRef   = useRef([]);
  const streamRef   = useRef(null);  // MediaStream
  const timerRef    = useRef(null);
  const secondsRef  = useRef(0);

  const reset = useCallback(() => {
    setAudioBlob(null);
    setDuration('0:00');
    setError(null);
    secondsRef.current = 0;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    chunksRef.current = [];

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Voice recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mt = preferredMimeType();
      setMimeType(mt || 'audio/webm');

      const recorder = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined);
      mediaRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mt || 'audio/webm' });
        setAudioBlob(blob);
        // Stop all tracks to release the mic indicator
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start(100); // collect data every 100ms
      setRecording(true);

      // Duration timer
      secondsRef.current = 0;
      timerRef.current = setInterval(() => {
        secondsRef.current += 1;
        const m = Math.floor(secondsRef.current / 60);
        const s = String(secondsRef.current % 60).padStart(2, '0');
        setDuration(`${m}:${s}`);
      }, 1000);

    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone permission denied. Please allow microphone access.');
      } else {
        setError('Could not start recording: ' + err.message);
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      mediaRef.current.stop();
    }
    setRecording(false);
  }, []);

  return { recording, start, stop, audioBlob, mimeType, duration, error, reset };
}
