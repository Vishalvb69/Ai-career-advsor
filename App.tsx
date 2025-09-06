
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { type Profile, type Recommendation, type ChatMessage } from './types';
import Header from './components/Header';
import ProfileInput from './components/ProfileInput';
import RecommendationCard from './components/RecommendationCard';
import ChatInterface from './components/ChatInterface';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({ interests: '', skills: '', isBeginner: false });
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState<boolean>(false);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const getCareerAdvice = useCallback(async (currentProfile: Profile) => {
    if (!process.env.API_KEY) {
      setError("API key is missing. Please set up your environment variables.");
      return;
    }
    setIsLoadingRecommendation(true);
    setError(null);
    setRecommendation(null);
    setChatHistory([]);
    setChat(null);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = currentProfile.isBeginner
      ? `A user who is a beginner is interested in "${currentProfile.interests}". Their listed skills are: "${currentProfile.skills || 'None'}". 
        Act as an expert career advisor and create a beginner-friendly roadmap for them.
        Provide the following in JSON format:
        1. A suitable entry-level career path suggestion related to their interests.
        2. A brief, encouraging explanation (2-3 sentences) of why this is a great starting point.
        3. A list of 5-7 foundational, step-by-step skills they should learn first to start their journey.
        4. The name of one inspirational person who has a great learning story in this field.`
      : `Analyze the following user profile and act as an expert career advisor.
        User Interests: ${currentProfile.interests}
        User Skills: ${currentProfile.skills}
        Based on this unique profile, provide the following in JSON format:
        1. A suitable career path suggestion.
        2. A brief, encouraging explanation (2-3 sentences) of why this career is a good fit.
        3. A list of 5-7 specific, actionable skills required for success in this career.
        4. The name of one famous, inspirational person who has excelled in this career.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              career: { type: Type.STRING, description: "The suggested career title." },
              explanation: { type: Type.STRING, description: "A brief explanation for the career suggestion." },
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of actionable skills for the suggested career."
              },
              famousPerson: { 
                type: Type.STRING, 
                description: "The name of a famous person who has excelled in this career."
              },
            },
            required: ["career", "explanation", "skills", "famousPerson"],
          }
        }
      });
      
      const responseText = response.text.trim();
      const parsedRecommendation: Recommendation = JSON.parse(responseText);
      setRecommendation(parsedRecommendation);

      const systemInstruction = currentProfile.isBeginner
        ? `You are a friendly AI career advisor. The user is a beginner with interests in "${currentProfile.interests}". You have recommended a career as a "${parsedRecommendation.career}". Your goal is to answer their follow-up questions with a focus on beginner-friendly concepts and resources. Keep your responses brief, conversational, human-like, and directly to the point. Avoid lengthy explanations unless asked.`
        : `You are a friendly AI career advisor. The user has interests in "${currentProfile.interests}" and skills in "${currentProfile.skills}". You have recommended a career as a "${parsedRecommendation.career}". Your goal is to answer their follow-up questions. Keep your responses brief, conversational, human-like, and directly to the point. Avoid lengthy explanations unless asked.`;
      
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
        }
      });
      setChat(newChat);

    } catch (e) {
      console.error(e);
      setError("Failed to get career advice. The model may be busy. Please try again later.");
    } finally {
      setIsLoadingRecommendation(false);
    }
  }, []);

  const handleAskQuestion = async (question: string) => {
    if (!chat || !question.trim()) return;

    setIsLoadingChat(true);
    const userMessage: ChatMessage = { role: 'user', text: question };
    setChatHistory(prev => [...prev, userMessage]);

    const messageForApi = `${question.trim()}\n\nDo not use * in the answers.`;

    try {
      const responseStream = await chat.sendMessageStream({ message: messageForApi });
      
      let aiResponseText = '';
      const aiMessage: ChatMessage = { role: 'model', text: '' };
      setChatHistory(prev => [...prev, aiMessage]);

      for await (const chunk of responseStream) {
        aiResponseText += chunk.text;
        setChatHistory(prev => {
            const newHistory = [...prev];
            if(newHistory.length > 0 && newHistory[newHistory.length - 1].role === 'model'){
                 newHistory[newHistory.length - 1].text = aiResponseText;
            }
            return newHistory;
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <div className="min-h-screen text-brand-dark-text dark:text-brand-light font-sans flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <div className="w-full max-w-7xl h-full md:h-[90vh] max-h-[1000px] bg-brand-light-2 dark:bg-brand-dark-2 rounded-4xl shadow-2xl shadow-brand-yellow/10 flex flex-col md:flex-row overflow-hidden border border-black/10 dark:border-white/10">
        
        {/* Sidebar */}
        <aside className="w-full md:w-1/3 md:max-w-sm bg-brand-light-3 dark:bg-brand-dark p-6 sm:p-8 flex flex-col space-y-6 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/10">
          <Header onToggleTheme={handleToggleTheme} theme={theme}/>
          <p className="text-brand-gray-light dark:text-brand-gray text-sm">
            Tell us about your capabilities and professional aspirations. Our AI will analyze your profile to generate a personalized career roadmap.
          </p>
          <ProfileInput
            profile={profile}
            setProfile={setProfile}
            onGetRecommendation={getCareerAdvice}
            isLoading={isLoadingRecommendation}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 flex flex-col overflow-y-auto">
          {error && <div className="mb-4 text-center text-brand-yellow bg-yellow-900/50 p-3 rounded-lg">{error}</div>}
          
          <div className="flex-grow">
            <RecommendationCard recommendation={recommendation} isLoading={isLoadingRecommendation} />
          </div>

          {recommendation && (
            <div className="mt-auto pt-6">
              <ChatInterface
                chatHistory={chatHistory}
                onAskQuestion={handleAskQuestion}
                isLoading={isLoadingChat}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
