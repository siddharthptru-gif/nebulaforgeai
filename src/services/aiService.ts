import { GoogleGenAI, Type } from "@google/genai";

export interface GeneratedPage {
  name: string;
  html: string;
  seo: {
    title: string;
    description: string;
  };
}

export interface GeneratedSite {
  pages: GeneratedPage[];
  theme: {
    colors: {
      primary: string;
      secondary: string;
      bg: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
}

export const generateWebsite = async (prompt: string, theme: string = "modern"): Promise<GeneratedSite> => {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, theme }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate website");
  }

  return response.json();
};
