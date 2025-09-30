import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon, LoadingSpinner } from './icons';

interface AIAssistButtonProps {
  reportTitle: string;
  disciplineTitle: string;
  disciplineDescription: string;
  currentContent: string;
  onStream: (chunk: string) => void;
  onDone: () => void;
}

export const AIAssistButton: React.FC<AIAssistButtonProps> = ({
  reportTitle,
  disciplineTitle,
  disciplineDescription,
  currentContent,
  onStream,
  onDone,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAIAssist = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is missing. Please ensure it is configured correctly.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are an expert in the 8D problem-solving methodology.
        For a problem titled "${reportTitle || 'Untitled Report'}", provide guidance for the following discipline:
        
        **Discipline:** ${disciplineTitle}
        **Description:** ${disciplineDescription}
        
        The user has already written:
        ---
        ${currentContent || '(empty)'}
        ---

        Based on this, generate a concise, actionable, and helpful text to continue or start writing this section.
        If the current content is empty, generate a starting point. If there is existing content, improve or expand upon it.
        Provide the response as clear, well-structured text. Use bullet points or numbered lists for clarity where appropriate. 
        Do not repeat the discipline title, description, or the user's existing text. Only provide the new content.
      `;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      for await (const chunk of responseStream) {
        onStream(chunk.text);
      }

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`AI assist failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      onDone();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAIAssist}
        disabled={isLoading}
        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
        aria-label="Get AI Assistance"
      >
        {isLoading ? (
          <LoadingSpinner className="w-5 h-5" />
        ) : (
          <SparklesIcon className="w-5 h-5" />
        )}
      </button>
      {error && <p className="text-xs text-red-500 mt-1 pl-1 absolute -bottom-5 left-0 w-full">{error}</p>}
    </>
  );
};
