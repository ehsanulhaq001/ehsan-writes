import React, { useState, useEffect, useRef } from "react";

interface TextToSpeechProps {
  content: string;
  title: string;
  showControls?: boolean;
  setShowControls?: (show: boolean) => void;
  panelMode?: boolean;
  showPanel?: boolean;
  setShowPanel?: (show: boolean) => void;
  setIsPlaying?: (playing: boolean) => void;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  content,
  title,
  showControls = false,
  setShowControls,
  panelMode = false,
  showPanel = false,
  setShowPanel,
  setIsPlaying,
}) => {
  const [isPlaying, setIsPlayingLocal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [rate, setRate] = useState(1);
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>(
    []
  );
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textChunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef(0);

  // Update parent component when playing state changes
  useEffect(() => {
    if (setIsPlaying) {
      setIsPlaying(isPlaying);
    }
  }, [isPlaying, setIsPlaying]);

  // Extract plain text from HTML content
  const extractTextFromHTML = (html: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const scripts = tempDiv.querySelectorAll("script, style");
    scripts.forEach((el) => el.remove());

    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.replace(/\s+/g, " ").trim();
  };

  // Split text into chunks to avoid speech synthesis limits
  const splitTextIntoChunks = (
    text: string,
    maxLength: number = 200
  ): string[] => {
    const sentences = text.split(/[.!?]+\s+/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxLength && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ". " : "") + sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter((chunk) => chunk.length > 0);
  };

  // Initialize voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        const englishVoices = voices.filter((v) => v.lang.startsWith("en-"));
        setEnglishVoices(englishVoices);
        setSelectedVoiceIndex(0);
      };

      loadVoices();
      speechSynthesis.addEventListener("voiceschanged", loadVoices);

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);

  // Prepare text chunks when content changes
  useEffect(() => {
    const plainText = extractTextFromHTML(content);
    const fullText = `${title}. ${plainText}`;
    textChunksRef.current = splitTextIntoChunks(fullText);
    currentChunkIndexRef.current = 0;
  }, [content, title]);

  const speakNextChunk = () => {
    if (currentChunkIndexRef.current >= textChunksRef.current.length) {
      setIsPlayingLocal(false);
      setIsPaused(false);
      currentChunkIndexRef.current = 0;
      return;
    }

    const chunk = textChunksRef.current[currentChunkIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.rate = rate;

    if (englishVoices.length > 0 && selectedVoiceIndex < englishVoices.length) {
      utterance.voice = englishVoices[selectedVoiceIndex];
    }

    utterance.onend = () => {
      currentChunkIndexRef.current++;
      speakNextChunk();
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsPlayingLocal(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (!isSupported) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlayingLocal(true);
    } else {
      currentChunkIndexRef.current = 0;
      speakNextChunk();
      setIsPlayingLocal(true);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlayingLocal(false);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlayingLocal(false);
    setIsPaused(false);
    currentChunkIndexRef.current = 0;
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      handleStop();
      setTimeout(() => handlePlay(), 100);
    }
  };

  const handleVoiceChange = (index: number) => {
    setSelectedVoiceIndex(index);
    if (isPlaying) {
      handleStop();
      setTimeout(() => handlePlay(), 100);
    }
  };

  const togglePanel = () => {
    if (setShowPanel) {
      setShowPanel(!showPanel);
    }
  };

  if (!isSupported) {
    return null;
  }

  // Panel mode - show only the settings in the external panel
  if (panelMode) {
    return (
      <div className="tts-panel-settings">
        <div className="tts-settings-row">
          <div className="tts-setting">
            <label>Speed</label>
            <div className="rate-control">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              />
              <span>{rate.toFixed(1)}×</span>
            </div>
          </div>

          {englishVoices.length > 0 && (
            <div className="tts-setting">
              <label>Voice</label>
              <select
                value={selectedVoiceIndex}
                onChange={(e) => handleVoiceChange(parseInt(e.target.value))}
              >
                {englishVoices.map((voice, index) => (
                  <option key={`${voice.name}-${index}`} value={index}>
                    {voice.name.split(" ")[0]} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="tts-setting">
            <label>PROGRESS</label>
            <span className="tts-progress">
              {currentChunkIndexRef.current + 1}/{textChunksRef.current.length}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Icon mode - new design with expandable controls
  return (
    <div className="tts-container">
      <div className="tts-controls-wrapper">
        {/* Main play/pause button - always visible */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="tts-main-btn"
          title={
            isPlaying ? "Pause audio" : isPaused ? "Resume audio" : "Play audio"
          }
        >
          {isPlaying ? (
            // Pause icon
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : isPaused ? (
            // Play icon (when controls are expanded)
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="5,3 19,12 5,21 5,3"></polygon>
            </svg>
          ) : (
            // Speaker icon (when controls are collapsed)
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polygon points="11 5,6 9,2 9,2 15,6 15,11 19,11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          )}
        </button>

        {/* Show additional controls when playing or paused */}
        {(isPlaying || isPaused) && (
          <>
            {/* Wave animation - only animate when actually playing */}
            <div className={`tts-wave-animation ${isPaused ? "paused" : ""}`}>
              <div className="wave-bar" style={{ animationDelay: "0ms" }}></div>
              <div
                className="wave-bar"
                style={{ animationDelay: "100ms" }}
              ></div>
              <div
                className="wave-bar"
                style={{ animationDelay: "200ms" }}
              ></div>
              <div
                className="wave-bar"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>

            {/* Stop button */}
            <button
              onClick={handleStop}
              className="tts-stop-btn-compact"
              title="Stop audio"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="6" y="6" width="12" height="12" />
              </svg>
            </button>

            {/* Dropdown arrow */}
            <button
              onClick={togglePanel}
              className="tts-dropdown-btn"
              title="Show audio settings"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  transform: showPanel ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;
