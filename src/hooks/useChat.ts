import { useState, useCallback } from "react";
import { ChatMessage, Recommendation } from "../types";
import { v4 as uuidv4 } from "uuid";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "system",
      content: "Hello! I can help you configure an evaluation for your AI system. What would you like to test today? (e.g., 'Test my RAG agent for safety' or 'Evaluate python coding ability')",
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const systemMsg: ChatMessage = {
        id: uuidv4(),
        role: "system",
        content: data.content,
        timestamp: Date.now(),
        recommendation: data.recommendation || undefined,
      };

      setMessages((prev) => [...prev, systemMsg]);
    } catch (error) {
      console.error("Error in chat flow:", error);
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: "system",
        content: "Sorry, I encountered an error while processing your request. Please ensure the backend server is running.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const acceptRecommendation = useCallback((rec: Recommendation) => {
    const successMsg: ChatMessage = {
      id: uuidv4(),
      role: "system",
      content: `Great! I've configured the evaluation with **${rec.dataset.name}** and **${rec.metrics.length} metrics**. You're ready to run!`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, successMsg]);
  }, []);

  const modifyRecommendation = useCallback((rec: Recommendation) => {
    // This is now handled by the UI to open the dialog
    console.log("Modify requested for scenario:", rec.scenario.id);
  }, []);

  const updateMetrics = useCallback((rec: Recommendation, newMetrics: any[]) => {
    const updateMsg: ChatMessage = {
      id: uuidv4(),
      role: "system",
      content: `I've updated the configuration. Now using **${newMetrics.length} metrics** (Added: ${newMetrics.filter(m => !rec.metrics.find(rm => rm.id === m.id)).map(m => m.name).join(", ") || "None"}).`,
      timestamp: Date.now(),
      recommendation: { ...rec, metrics: newMetrics }
    };
    setMessages((prev) => [...prev, updateMsg]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    acceptRecommendation,
    modifyRecommendation,
    updateMetrics
  };
};
