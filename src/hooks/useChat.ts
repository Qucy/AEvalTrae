import { useState, useCallback } from "react";
import { ChatMessage, Recommendation } from "../types";
import { MockService } from "../mocks/MockService";
import { v4 as uuidv4 } from "uuid";

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
      // 1. Simulate Intent Extraction
      const intent = await MockService.simulateIntentExtraction(content);
      
      // 2. Simulate Recommendation
      const recommendation = await MockService.simulateRecommendation(intent);

      // 3. Construct System Response
      let systemContent = "I've analyzed your request. ";
      if (intent === "rag_safety") {
        systemContent += "Since you're focused on safety for a RAG system, I've prioritized metrics that detect hallucinations and jailbreaks.";
      } else if (intent === "code_eval") {
        systemContent += "For coding tasks, accuracy and execution-based metrics are crucial.";
      } else if (intent === "general_chat") {
        systemContent += "For general chat, we should look at tone and coherence.";
      } else {
        systemContent += "Here is a recommended configuration based on standard best practices.";
      }

      const systemMsg: ChatMessage = {
        id: uuidv4(),
        role: "system",
        content: systemContent,
        timestamp: Date.now(),
        recommendation: recommendation || undefined,
      };

      setMessages((prev) => [...prev, systemMsg]);
    } catch (error) {
      console.error("Error in chat flow:", error);
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: "system",
        content: "Sorry, I encountered an error while processing your request.",
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
