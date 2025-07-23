import React, { useState, useEffect, useRef, useCallback } from "react";

interface TextToSpeechProps {
  content: string;
  title: string;
  panelMode?: boolean;
  showPanel?: boolean;
  setShowPanel?: (show: boolean) => void;
  // Shared state props
  rate?: number;
  setRate?: (rate: number) => void;
  voiceIndex?: number;
  setVoiceIndex?: (index: number) => void;
  currentChunkIndex?: number;
  setCurrentChunkIndex?: (index: number) => void;
  // Visual feedback props
  enableHighlighting?: boolean;
  contentElementId?: string;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({
  content,
  title,
  panelMode = false,
  showPanel = false,
  setShowPanel,
  rate: externalRate,
  setRate: setExternalRate,
  voiceIndex: externalVoiceIndex,
  setVoiceIndex: setExternalVoiceIndex,
  currentChunkIndex: externalCurrentChunkIndex,
  setCurrentChunkIndex: setExternalCurrentChunkIndex,
  enableHighlighting = true,
  contentElementId = "post-content",
}) => {
  const [isPlaying, setIsPlayingLocal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  // Use internal state only if external props are not provided
  const [internalRate, setInternalRate] = useState(1);
  const [englishVoices, setEnglishVoices] = useState<SpeechSynthesisVoice[]>(
    []
  );
  const [internalSelectedVoiceIndex, setInternalSelectedVoiceIndex] =
    useState(0);
  const [internalCurrentChunkIndex, setInternalCurrentChunkIndex] = useState(0);

  // Use external or internal state
  const rate = externalRate !== undefined ? externalRate : internalRate;
  const selectedVoiceIndex =
    externalVoiceIndex !== undefined
      ? externalVoiceIndex
      : internalSelectedVoiceIndex;
  const currentChunkIndex =
    externalCurrentChunkIndex !== undefined
      ? externalCurrentChunkIndex
      : internalCurrentChunkIndex;

  const setCurrentChunkIndex = useCallback(
    (index: number) => {
      if (setExternalCurrentChunkIndex) {
        setExternalCurrentChunkIndex(index);
      } else {
        setInternalCurrentChunkIndex(index);
      }
    },
    [setExternalCurrentChunkIndex]
  );

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textChunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef(0);
  const highlightElementRef = useRef<HTMLElement | null>(null);

  // Extract plain text from HTML content
  const extractTextFromHTML = (html: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Remove unwanted elements
    const unwantedElements = tempDiv.querySelectorAll(
      "script, style, code, pre"
    );
    unwantedElements.forEach((el) => el.remove());

    // Get text content
    let text = tempDiv.textContent || tempDiv.innerText || "";

    // Clean up whitespace but preserve paragraph breaks
    text = text
      .replace(/\t/g, " ") // Replace tabs with spaces
      .replace(/[ \t]+/g, " ") // Collapse multiple spaces/tabs
      .replace(/\n\s*\n\s*/g, "\n\n") // Normalize paragraph breaks
      .trim();

    return text;
  };

  // Split text into chunks to avoid speech synthesis limits
  const splitTextIntoChunks = (
    text: string,
    maxLength: number = 400
  ): string[] => {
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const chunks: string[] = [];

    for (const paragraph of paragraphs) {
      const cleanParagraph = paragraph.trim();

      if (cleanParagraph.length <= maxLength) {
        chunks.push(cleanParagraph);
        continue;
      }

      const sentences = cleanParagraph.split(/(?<=[.!?:])\s+/);
      let currentChunk = "";

      for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();

        if (
          currentChunk &&
          currentChunk.length + trimmedSentence.length + 1 > maxLength
        ) {
          chunks.push(currentChunk.trim());
          currentChunk = trimmedSentence;
        } else {
          currentChunk += (currentChunk ? " " : "") + trimmedSentence;
        }
      }

      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
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
        if (setExternalVoiceIndex) {
          setExternalVoiceIndex(0);
        } else {
          setInternalSelectedVoiceIndex(0);
        }
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
    const chunks = splitTextIntoChunks(fullText);

    textChunksRef.current = chunks;
    currentChunkIndexRef.current = 0;
    setCurrentChunkIndex(0);
    removeHighlight(); // Clear any existing highlights when content changes
  }, [content, title]);

  // Highlighting functions
  const highlightCurrentChunk = useCallback(() => {
    console.log("highlightCurrentChunk called:", {
      enableHighlighting,
      panelMode,
      contentElementId,
      currentIndex: currentChunkIndexRef.current,
      totalChunks: textChunksRef.current.length,
    });

    if (!enableHighlighting || panelMode) {
      console.log("Highlighting disabled or in panel mode");
      return;
    }

    const contentElement = document.querySelector(`.${contentElementId}`);
    console.log("Content element found:", contentElement);

    if (
      !contentElement ||
      currentChunkIndexRef.current >= textChunksRef.current.length
    ) {
      console.log("No content element or chunk index out of bounds");
      return;
    }

    // Remove previous highlight
    removeHighlight();

    const currentChunk = textChunksRef.current[currentChunkIndexRef.current];
    console.log("Current chunk:", currentChunk?.substring(0, 100) + "...");

    if (!currentChunk) return;

    try {
      // Simplified highlighting - just find and highlight the first few words
      const searchWords = currentChunk.trim().split(" ").slice(0, 5).join(" ");
      console.log("Searching for:", searchWords);

      const highlighted = highlightTextInElement(
        contentElement as HTMLElement,
        searchWords
      );

      console.log("Highlighting result:", highlighted);

      if (highlighted) {
        // Auto-scroll to highlighted element
        setTimeout(() => {
          highlighted.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }, 100);
      }
    } catch (error) {
      console.warn("Error highlighting text:", error);
    }
  }, [enableHighlighting, panelMode, contentElementId]);

  const removeHighlight = useCallback(() => {
    // Remove all existing highlights
    const highlights = document.querySelectorAll(".tts-highlight");
    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      if (parent) {
        // Replace highlight with its text content
        const textNode = document.createTextNode(highlight.textContent || "");
        parent.insertBefore(textNode, highlight);
        parent.removeChild(highlight);
        parent.normalize(); // Merge adjacent text nodes
      }
    });
    highlightElementRef.current = null;
  }, []);

  const highlightTextInElement = useCallback(
    (element: HTMLElement, searchText: string): HTMLElement | null => {
      console.log("highlightTextInElement called with:", searchText);

      const cleanSearchText = searchText.trim();
      if (cleanSearchText.length < 5) {
        console.log("Search text too short");
        return null;
      }

      // Get the element's text content
      const elementText = element.textContent || "";
      console.log("Element text length:", elementText.length);

      // Find the search text (case insensitive)
      const searchIndex = elementText
        .toLowerCase()
        .indexOf(cleanSearchText.toLowerCase());
      console.log("Search index:", searchIndex);

      if (searchIndex === -1) {
        // Try with just the first 3 words
        const firstWords = cleanSearchText.split(" ").slice(0, 3).join(" ");
        const fallbackIndex = elementText
          .toLowerCase()
          .indexOf(firstWords.toLowerCase());
        console.log(
          "Fallback search for:",
          firstWords,
          "found at:",
          fallbackIndex
        );

        if (fallbackIndex === -1) return null;
      }

      try {
        // Simple approach: use innerHTML replacement
        const textToHighlight =
          searchIndex !== -1
            ? cleanSearchText
            : cleanSearchText.split(" ").slice(0, 3).join(" ");
        const actualIndex =
          searchIndex !== -1
            ? searchIndex
            : elementText.toLowerCase().indexOf(textToHighlight.toLowerCase());

        console.log(
          "Highlighting text:",
          textToHighlight,
          "at index:",
          actualIndex
        );

        // Get the actual text from the element at the found position
        const startIndex = actualIndex;
        const endIndex = actualIndex + textToHighlight.length;
        const actualTextToHighlight = elementText.substring(
          startIndex,
          endIndex
        );

        console.log(
          "Actual text to highlight:",
          JSON.stringify(actualTextToHighlight)
        );

        // Escape special characters including newlines and emojis
        const escapedText = actualTextToHighlight
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\s+/g, "\\s+"); // Handle any whitespace including newlines

        console.log("Escaped regex:", escapedText);

        // Create a regex that handles multiline text
        const regex = new RegExp(`(${escapedText})`, "gi");

        const originalHTML = element.innerHTML;
        let highlighted = false;

        // Replace only the first occurrence
        const newHTML = originalHTML.replace(regex, (match) => {
          console.log("Regex matched:", JSON.stringify(match));
          if (!highlighted) {
            highlighted = true;
            return `<span class="tts-highlight">${match}</span>`;
          }
          return match;
        });

        console.log("Highlighted:", highlighted);

        if (highlighted) {
          element.innerHTML = newHTML;
          const highlightElement = element.querySelector(
            ".tts-highlight"
          ) as HTMLElement;
          console.log("Created highlight element:", highlightElement);

          if (highlightElement) {
            highlightElementRef.current = highlightElement;
            return highlightElement;
          }
        } else {
          // Fallback: try a simpler approach with just the first few words
          const simpleText = textToHighlight.split(/\s+/).slice(0, 2).join(" ");
          console.log("Trying fallback with:", simpleText);

          const simpleRegex = new RegExp(
            `(${simpleText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
            "gi"
          );

          const fallbackHTML = originalHTML.replace(simpleRegex, (match) => {
            if (!highlighted) {
              highlighted = true;
              return `<span class="tts-highlight">${match}</span>`;
            }
            return match;
          });

          if (highlighted) {
            element.innerHTML = fallbackHTML;
            const highlightElement = element.querySelector(
              ".tts-highlight"
            ) as HTMLElement;
            console.log(
              "Created fallback highlight element:",
              highlightElement
            );

            if (highlightElement) {
              highlightElementRef.current = highlightElement;
              return highlightElement;
            }
          }
        }

        console.log("No highlighting applied");
        return null;
      } catch (error) {
        console.warn("Error in highlightTextInElement:", error);
        return null;
      }
    },
    []
  );

  // Cleanup effect
  useEffect(() => {
    return () => {
      removeHighlight();
    };
  }, [removeHighlight]);

  const speakNextChunk = () => {
    console.log(
      "speakNextChunk called, chunk index:",
      currentChunkIndexRef.current
    );

    if (currentChunkIndexRef.current >= textChunksRef.current.length) {
      setIsPlayingLocal(false);
      setIsPaused(false);
      currentChunkIndexRef.current = 0;
      setCurrentChunkIndex(0);
      removeHighlight();
      return;
    }

    const chunk = textChunksRef.current[currentChunkIndexRef.current];
    console.log("About to speak chunk:", chunk?.substring(0, 50) + "...");

    // Highlight current chunk
    console.log("Calling highlightCurrentChunk...");
    highlightCurrentChunk();

    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.rate = rate;

    if (englishVoices.length > 0 && selectedVoiceIndex < englishVoices.length) {
      utterance.voice = englishVoices[selectedVoiceIndex];
    }

    utterance.onend = () => {
      console.log("Chunk finished, moving to next chunk");
      currentChunkIndexRef.current++;
      setCurrentChunkIndex(currentChunkIndexRef.current);
      speakNextChunk();
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsPlayingLocal(false);
      setIsPaused(false);
      removeHighlight();
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
      setCurrentChunkIndex(0);
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
    setCurrentChunkIndex(0);
    removeHighlight();
  };

  const handleRateChange = (newRate: number) => {
    if (setExternalRate) {
      setExternalRate(newRate);
    } else {
      setInternalRate(newRate);
    }
    // Restart audio if it's playing or paused to apply new settings
    if (isPlaying || isPaused) {
      handleStop();
      setTimeout(() => handlePlay(), 100);
    }
  };

  const handleVoiceChange = (index: number) => {
    if (setExternalVoiceIndex) {
      setExternalVoiceIndex(index);
    } else {
      setInternalSelectedVoiceIndex(index);
    }
    // Restart audio if it's playing or paused to apply new settings
    if (isPlaying || isPaused) {
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
              {currentChunkIndex + 1}/{textChunksRef.current.length}
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
              <div
                className="wave-bar bar-1"
                style={{ animationDelay: "0ms", animationDuration: "1.2s" }}
              ></div>
              <div
                className="wave-bar bar-2"
                style={{ animationDelay: "150ms", animationDuration: "1.5s" }}
              ></div>
              <div
                className="wave-bar bar-3"
                style={{ animationDelay: "300ms", animationDuration: "0.9s" }}
              ></div>
              <div
                className="wave-bar bar-4"
                style={{ animationDelay: "100ms", animationDuration: "1.3s" }}
              ></div>
              <div
                className="wave-bar bar-5"
                style={{ animationDelay: "450ms", animationDuration: "1.1s" }}
              ></div>
              <div
                className="wave-bar bar-6"
                style={{ animationDelay: "250ms", animationDuration: "1.4s" }}
              ></div>
              <div
                className="wave-bar bar-7"
                style={{ animationDelay: "350ms", animationDuration: "1.0s" }}
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
