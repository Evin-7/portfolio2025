"use client";

export default function PrivacyChoicesButton() {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event("portfolio:privacy-choices"))}>
      Privacy choices
    </button>
  );
}
