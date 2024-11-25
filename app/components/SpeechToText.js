"use client"

import React from "react";
import { useState } from "react";
import { MicrophoneIcon } from '@heroicons/react/24/outline'



export default function SpeechToText() {
  /* State to store transcript from audio */
  const [transcript, setTranscript] = useState("");
  
  
  /* Function to start recording audio */
  function handleRecord() {
    // Start recording audio
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onresult = async function (event) {
      setTranscript(event.results[0][0].transcript);
    }

    recognition.start();
  }
  
  return (
    <div className="flex flex-col w-full h-screen bg-[#fcf5eb]">
      {/* Header container: */}
      <div className="flex relative items-center justify-center pt-7">
        {/* Box with shadow: */}
        <div className="relative w-44">
          {/* Box shadow: */}
          <div className="absolute -bottom-1 left-1 w-40 h-[52px] bg-black rounded-xl"></div>

          {/* Green Box: */}
          <div className="relative w-40 text-black py-3 border-2 border-black rounded-xl bg-[#26d366] text-center">
            <p className="font-normal">
              Voice Chat
            </p>
          </div>
        </div>
      </div>


      {/* Main Content Container: */}
      <div className="flex flex-col flex-1 items-center justify-center gap-5">
        {/* Transcript Box: */}
        <div className="w-1/2 h-1/2 border-2 border-black rounded-xl p-4">
          <p className="text-sm text-black">Transcript:</p>
          <p className="text-sm text-black">{transcript}</p>
        </div>

        {/* Microphone: */}
        <button className="bg-white p-4 rounded-full border-2 border-black"
                onClick={handleRecord}
        >
          <MicrophoneIcon className="w-5 h-5 text-black"/>
        </button>
      </div>
    </div>
  );
}