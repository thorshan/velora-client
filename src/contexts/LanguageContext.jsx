import React, { createContext, useContext, useState } from "react";

// 1. Create Context
const LanguageContext = createContext();

// 2. Hook to use language context
export const useLanguage = () => useContext(LanguageContext);

// 3. Provider component
export const LanguageProvider = ({ children }) => {
    
  // default language can come from localStorage or default to "en"
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "en"
  );

  // function to switch language
  const toggleLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
