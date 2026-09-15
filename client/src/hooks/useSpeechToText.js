import { useEffect, useRef, useState } from "react";

const useSpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error(
        "Speech Recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    // Speech Recognition configuration
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // --------------------------------
    // Recognition started
    // --------------------------------
    recognition.onstart = () => {
      console.log("🎤 Speech recognition started");
      setIsListening(true);
    };

    // --------------------------------
    // Speech result received
    // --------------------------------
    recognition.onresult = (event) => {
      console.log("🗣️ Speech result received");

      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += text + " ";
        } else {
          interimTranscript += text;
        }
      }

      const completeTranscript =
        finalTranscriptRef.current + interimTranscript;

      setTranscript(completeTranscript.trim());
    };

    // --------------------------------
    // Recognition error
    // --------------------------------
    recognition.onerror = (event) => {
      console.log(
        "⚠️ Speech recognition error:",
        event.error
      );

      if (event.error === "no-speech") {
        console.log(
          "No speech detected. You can continue speaking."
        );
      }

      if (event.error === "not-allowed") {
        console.error(
          "Microphone permission was denied."
        );

        shouldListenRef.current = false;
        setIsListening(false);
      }

      if (event.error === "audio-capture") {
        console.error(
          "No microphone was detected."
        );

        shouldListenRef.current = false;
        setIsListening(false);
      }

      if (event.error === "network") {
        console.error(
          "Speech recognition network error."
        );
      }
    };

    // --------------------------------
    // Recognition ended
    // --------------------------------
    recognition.onend = () => {
      console.log("🔴 Speech recognition ended");

      setIsListening(false);

      // Restart only when user is still listening
      if (shouldListenRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.log(
              "Recognition restart skipped."
            );
          }
        }, 300);
      }
    };

    recognitionRef.current = recognition;

    // --------------------------------
    // Cleanup
    // --------------------------------
    return () => {
      shouldListenRef.current = false;

      try {
        recognition.stop();
      } catch (error) {
        // Ignore cleanup errors
      }

      recognitionRef.current = null;
    };
  }, []);

  // --------------------------------
  // Start listening
  // --------------------------------
  const startListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      console.error(
        "Speech Recognition is not available."
      );
      return;
    }

    if (shouldListenRef.current) {
      console.log("Already listening.");
      return;
    }

    shouldListenRef.current = true;

    try {
      recognition.start();
      console.log(
        "🎙️ Starting microphone listening..."
      );
    } catch (error) {
      console.log(
        "Recognition start skipped:",
        error.message
      );
    }
  };

  // --------------------------------
  // Stop listening
  // --------------------------------
  const stopListening = () => {
    const recognition = recognitionRef.current;

    shouldListenRef.current = false;

    if (!recognition) return;

    try {
      recognition.stop();
    } catch (error) {
      console.log(
        "Recognition already stopped."
      );
    }

    setIsListening(false);

    console.log(
      "🛑 Speech recognition stopped."
    );
  };

  // --------------------------------
  // Clear transcript
  // --------------------------------
  const clearTranscript = () => {
    finalTranscriptRef.current = "";
    setTranscript("");
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    clearTranscript,
  };
};

export default useSpeechToText;