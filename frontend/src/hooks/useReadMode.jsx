import { useEffect } from 'react';

export const useReadMode = (isActive) => {
  useEffect(() => {
    if (!isActive) {
      window.speechSynthesis.cancel();
      return;
    }

    let currentUtterance = null;
    let currentElement = null;
    let originalHtml = '';

    const handleMouseOver = (e) => {
      const el = e.target;
      // Define elements that are usually pure text containers block or inline
      if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI'].includes(el.tagName)) {
        if (currentElement === el) return;
        
        window.speechSynthesis.cancel();
        
        if (currentElement && originalHtml) {
          currentElement.innerHTML = originalHtml;
        }

        currentElement = el;
        originalHtml = el.innerHTML;
        
        const textToRead = el.innerText;
        if (!textToRead.trim()) return;

        const words = textToRead.split(/(\s+)/);
        
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        utterance.onboundary = (event) => {
          if (event.name === 'word') {
             // Map character boundary back to word element
             let charCount = 0;
             let targetWordIndex = -1;
             for (let i = 0; i < words.length; i++) {
                if (charCount <= event.charIndex && charCount + words[i].length > event.charIndex) {
                   targetWordIndex = i;
                   break;
                }
                charCount += words[i].length;
             }
             
             if (targetWordIndex !== -1) {
                // Read out text replacement to indicate highlight
                el.innerHTML = words.map((w, index) => 
                  (index === targetWordIndex && w.trim().length > 0) 
                  ? `<span class="bg-blue-100 text-blue-900 border-b border-blue-300 rounded px-1 transition-colors duration-200">${w}</span>` 
                  : w
                ).join('');
             }
          }
        };

        utterance.onend = () => {
          if (currentElement === el) {
             el.innerHTML = originalHtml;
          }
        };

        utterance.onerror = () => {
          if (currentElement === el) {
             el.innerHTML = originalHtml;
          }
        }

        window.speechSynthesis.speak(utterance);
        currentUtterance = utterance;
      }
    };

    const handleMouseOut = (e) => {
      // Optional: stop reading when mouse leaves.
      // Doing nothing preserves reading.
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.speechSynthesis.cancel();
      if (currentElement && originalHtml) {
        currentElement.innerHTML = originalHtml;
      }
    };
  }, [isActive]);
};
