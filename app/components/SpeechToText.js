"use client";

import React, { useEffect, useState, useRef } from "react";
import { MicrophoneIcon } from "@heroicons/react/24/outline";

export default function SpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  let lastTranscript = "";
  let silenceTimer;

  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");

      if (currentTranscript !== lastTranscript) {
        clearTimeout(silenceTimer); // Reset silence detection timer
        lastTranscript = currentTranscript; // Update the last known transcript
      }

      setTranscript(currentTranscript); // Update state with the transcript

      // Silence detection logic
      silenceTimer = setTimeout(() => {
        if (isListening && recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current.start(); // Restart recognition after silence
        }
      }, 3000); // Restart after 3 seconds of silence
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart if still listening
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimeout(silenceTimer); // Cleanup timer
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
      setError(null);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#fcf5eb]">
      <div className="flex relative items-center justify-center pt-7">
        <div className="relative w-44">
          <div className="absolute -bottom-1 left-1 w-40 h-[52px] bg-black rounded-xl"></div>
          <div className="relative w-40 text-black py-3 border-2 border-black rounded-xl bg-[#26d366] text-center">
            <p className="font-normal">Voice Chat</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 items-center justify-center gap-5">
        <div className="sm:w-1/2 w-4/5 h-1/2 border-2 border-black rounded-xl p-4">
          <p className="text-sm text-black font-semibold pb-2">Transcript:</p>
          <p className="text-sm text-black italic">{transcript || "Start speaking to see the transcript..."}</p>
        </div>

        <button
          className={`bg-white p-4 rounded-full border-2 border-black ${isListening ? "bg-red-500" : "bg-white"}`}
          onClick={isListening ? stopRecording : startRecording}
        >
          <MicrophoneIcon className="w-5 h-5 text-black" />
        </button>
      </div>
    </div>
  );
}
