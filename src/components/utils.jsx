import React, { useState } from "react";
import './styles.css'
export function ClipboardMessage({ text, children, dark }) {
  const [showMessage, setShowMessage] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 1000);
  };

  return (
    <div>
      <a style={{ cursor: "pointer" }} onClick={handleCopy}>
        {children}
      </a>
      {showMessage && (
        <div className={dark ? "message dark" : "message"}>copied</div>
      )}
    </div>
  );
}


export const isMobile =
/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);