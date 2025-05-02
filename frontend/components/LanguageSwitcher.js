'use client';

import { useState, useEffect } from 'react';

const languages = {
  en: 'English',
  hi: 'Hindi',
  gu: 'Gujarati',
};

export default function LanguageSwitcher() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('google-translate-script')) return; // Already loaded
  
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.id = 'google-translate-script';
    document.body.appendChild(script);
  
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,gu',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };
  }, []);
  

  const translateLanguage = (lang) => {
    if (!scriptLoaded) {
      alert('Translator not loaded yet.');
      return;
    }

    const checkIframeInterval = setInterval(() => {
      const frame = document.querySelector('iframe.goog-te-menu-frame');
      if (frame) {
        clearInterval(checkIframeInterval);

        const innerDoc = frame.contentDocument || frame.contentWindow.document;
        const items = innerDoc.querySelectorAll('.goog-te-menu2-item span.text');

        items.forEach((item) => {
          if (item.innerText.toLowerCase() === languages[lang].toLowerCase()) {
            item.click(); // Click on the selected language
          }
        });
      }
    }, 2000); // Increased interval to 2 seconds
  };

  return (
    <div>
      <select onChange={(e) => translateLanguage(e.target.value)} className="border p-2 rounded">
        {Object.entries(languages).map(([code, name]) => (
          <option value={code} key={code}>
            {name}
          </option>
        ))}
      </select>

      {/* Google Translate Element will be injected here */}
      <div id="google_translate_element" style={{ display: 'none' }} />
    </div>
  );
}

