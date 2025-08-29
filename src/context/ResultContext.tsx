"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ReviewData {
  company_name: string;
  good_reviews: string[];
  bad_reviews: string[];
}

interface ResultContextType {
  reviewData: ReviewData | null;
  setReviewData: React.Dispatch<React.SetStateAction<ReviewData | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export function ResultProvider({ children }: { children: ReactNode }) {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <ResultContext.Provider value={{ reviewData, setReviewData, loading, setLoading }}>
      {children}
    </ResultContext.Provider>
  );
}

export function useResult() {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
}
