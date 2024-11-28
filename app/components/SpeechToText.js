"use client"

import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { MicrophoneIcon } from '@heroicons/react/24/outline'



export default function SpeechToText() {
  /* State to store transcript from audio */
  const [transcript, setTranscript] = useState("");
  /* State to know whether the speech recognition is listening */
  const [isListening, setIsListening] = useState(false);
  /* State to handle errors: */
  const [error, setError] = useState(null);

  /* UseRef to store the SpeechRecognition instance: */
  const recognitionRef = useRef(null);
  
  
  /* Function to initialize the recognition/recording: */
  useEffect(() => {
    /* Check if the browser supports speech recognition: */
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    /* Start recording audio */
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    /* Keep listening until manually stopped and
    * show partial results while speaking: */
    recognition.continuous = true;
    recognition.interimResults = true;

    /* Set the language: */
    recognition.lang = "en-US";

    /* Update the transcript: */
    recognition.onresult = async function (event) {
      // const results = Array.from(event.results)
      //   .map((result) => result[0].transcript)
      //   .join(""); /* Join the partial results */
      // setTranscript(results);

      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
  
      setTranscript((prev) => prev + finalTranscript); // Append only finalized text
    }

    /* Handle errors: */
    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    }

    /* Handle end of speech recognition: */
    recognition.onend = () => {
      setIsListening(false);
    }

    

    /* Store the instance of recognition in recognitionRef: */
    recognitionRef.current = recognition;
  }, []);  /* Initialize the recogntion instance when the component mounts: */




  /* Handle start recording audio */
  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();

      /* Make recognitiion continuous: */
      // recognitionRef.current.continuous = true;

      setIsListening(true); 
    }
  }

  /* Handle stop recording audio */
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      /* Make recognitiion not continuous: */
      // recognitionRef.current.continuous = false;
      // 
    }
  }




  /* Render the component: */
  return (
    <div className="flex flex-col relative w-full min-h-screen bg-[#fcf5eb]">
      {/* Put the noise background: */}
      <div className="absolute w-full h-full opacity-5 bg-noise-patern"></div>
      
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
        <div className="flex flex-col sm:w-1/2 w-4/5 h-[44.7vh] border-2 border-black rounded-xl p-4 z-10">
          {/* Header: */}
          <p className="text-sm text-black font-semibold pb-3">Transcript:</p>

          {/* Scrollable Transcript: */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-[#676767] scrollbar-track-[#f4ede4]">
            <p className="text-sm text-black italic pr-4">
              {transcript}
            </p>
          </div>
        </div>


        {/* Recording Icons: */}
        <button className={`${isListening? "bg-red-400" : "bg-white"} p-4 rounded-full border-2 border-black z-10`}
                onClick={isListening? stopRecording : startRecording}
        >
          {/* Change icon based on when listening or not: */}
          {isListening?
            /* Stop Icon: */
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-4/5 h-4/5 bg-white border-black border-2 rounded-md animate-pulse"></div>
            </div>
            :
            /* Microphone Icon: */
            <MicrophoneIcon className="w-5 h-5 text-black"/>
          }
        </button>
      </div>
    </div>
  );
}