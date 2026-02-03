import { useState, useCallback } from "react";
import { ChatMessage, Metric, Recommendation } from "../types";
import { v4 as uuidv4 } from "uuid";
import { MockService } from "../mocks/MockService";

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
    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const intent = await MockService.simulateIntentExtraction(content);

      if (intent === "unknown") {
        const systemMsg: ChatMessage = {
          id: uuidv4(),
          role: "system",
          content:
            "I can help with a few demo evaluation setups. Which one best matches your goal?\n\n- RAG safety (hallucination/toxicity/refusal)\n- RAG accuracy (context adherence/relevance)\n- Code evaluation (python/coding)\n- General chat quality",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, systemMsg]);
        return;
      }

      const recommendation = await MockService.simulateRecommendation(intent);

      if (!recommendation) {
        const systemMsg: ChatMessage = {
          id: uuidv4(),
          role: "system",
          content:
            "I couldn't generate a recommendation for that request. Try something like “Test my RAG agent for safety” or “Evaluate python coding ability”.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, systemMsg]);
        return;
      }

      const systemMsg: ChatMessage = {
        id: uuidv4(),
        role: "system",
        content: `${recommendation.reason}\n\nHere’s a suggested evaluation configuration:`,
        timestamp: Date.now(),
        recommendation,
      };

      setMessages((prev) => [...prev, systemMsg]);
    } catch (error) {
      console.error("Error in chat flow:", error);
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        role: "system",
        content: "Sorry, I encountered an error while generating the prototype recommendation. Please try again.",
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
    void rec;
  }, []);

  const updateMetrics = useCallback((rec: Recommendation, newMetrics: Metric[]) => {
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
