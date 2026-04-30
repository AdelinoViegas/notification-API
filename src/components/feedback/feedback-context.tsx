"use client";

// FEEDBACK PHASE — remover após encerrar fase de testes
import { createContext, useContext, useState } from "react";

type FeedbackContextType = {
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
};

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <FeedbackContext.Provider value={{ submitted, setSubmitted }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback precisa estar dentro de FeedbackProvider");
  return ctx;
}
