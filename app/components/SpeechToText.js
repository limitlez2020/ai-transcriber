"use client";

import React, { useEffect, useState, useRef } from "react";
import { MicrophoneIcon } from "@heroicons/react/24/outline";

export default function SpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

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
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment; // Only add final results
        }
      }
      setTranscript(finalTranscript); // Update state with final transcript only
    };

    recognition.onerror = (event) => {
      setError(event.error);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Automatically restart if still listening
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition; // Save instance
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
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
