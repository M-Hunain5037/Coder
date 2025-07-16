import React, { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface LanguageSelectorProps {
  currentLanguage: string
  setLanguage: (language: string) => void
}

// Available programming languages
const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'golang', label: 'Go' },
  { value: 'cpp', label: 'C++' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'sql', label: 'SQL' },
  { value: 'r', label: 'R' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  setLanguage
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleLanguageSelect = async (lang: string) => {
    try {
      // Save language preference to electron store
      await window.electronAPI.updateConfig({ language: lang });
      
      // Update global language variable
      window.__LANGUAGE__ = lang;
      
      // Update state in React
      setLanguage(lang);
      
      console.log(`Language changed to ${lang}`);
    } catch (error) {
      console.error("Error updating language:", error);
    }
    
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Find the current language object
  const currentLangObj = LANGUAGES.find(lang => lang.value === currentLanguage) || LANGUAGES[0];

  return (
    <div className="mb-3 px-2 space-y-1">
      <div className="flex items-center justify-between text-[13px] font-medium text-white/90">
        <span>Language</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 rounded px-2 py-1 text-sm bg-black/80 text-white/90 border border-white/10 hover:border-white/20 focus:border-white/20 outline-none transition-colors min-w-[100px] justify-between cursor-pointer"
          >
            {currentLangObj.label}
            {dropdownOpen ? (
              <ChevronUp className="h-3 w-3 text-white/70" />
            ) : (
              <ChevronDown className="h-3 w-3 text-white/70" />
            )}
          </button>
          
          {dropdownOpen && (
            <div className="absolute z-[200] mt-1 w-full rounded-md bg-black border border-white/10 shadow-lg max-h-40 overflow-y-auto">
              <div className="py-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageSelect(lang.value)}
                    className={`block w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                      currentLanguage === lang.value
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
