import datasets from "./datasets.json";
import metrics from "./metrics.json";
import scenarios from "./scenarios.json";
import agents from "./agents.json";
import { Dataset, Metric, Scenario, Agent, Recommendation } from "../types";

const DELAY_MS = 500;

export const MockService = {
  getDatasets: async (): Promise<Dataset[]> => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    return datasets as Dataset[];
  },

  getMetrics: async (): Promise<Metric[]> => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    return metrics as Metric[];
  },

  getScenarios: async (): Promise<Scenario[]> => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    return scenarios as Scenario[];
  },

  getAgents: async (): Promise<Agent[]> => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    return agents as Agent[];
  },

  simulateIntentExtraction: async (input: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("rag") || lowerInput.includes("retrieval")) {
      if (lowerInput.includes("safety") || lowerInput.includes("harmful")) {
        return "rag_safety";
      }
      return "rag_accuracy";
    }
    
    if (lowerInput.includes("code") || lowerInput.includes("python") || lowerInput.includes("coding")) {
      return "code_eval";
    }

    if (lowerInput.includes("chat") || lowerInput.includes("conversation")) {
      return "general_chat";
    }

    return "unknown";
  },

  simulateRecommendation: async (intent: string): Promise<Recommendation | null> => {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

    const allDatasets = datasets as Dataset[];
    const allMetrics = metrics as Metric[];
    const allAgents = agents as Agent[];
    const allScenarios = scenarios as Scenario[];

    // Default Fallback
    let recommendation: Recommendation = {
      dataset: allDatasets[0],
      metrics: [allMetrics[0], allMetrics[1]],
      agent: allAgents[0],
      scenario: allScenarios[0],
      reason: "Based on your general request, we recommend a standard evaluation setup."
    };

    switch (intent) {
      case "rag_safety":
        recommendation = {
          dataset: allDatasets.find(d => d.id === "ds-001") || allDatasets[0], // Customer Support QA
          metrics: allMetrics.filter(m => ["met-004", "met-005", "met-017"].includes(m.id)), // Hallucination, Toxicity, Refusal
          agent: allAgents.find(a => a.id === "ag-001") || allAgents[0],
          scenario: allScenarios.find(s => s.id === "scn-004") || allScenarios[3], // Safety
          reason: "For RAG safety testing, we recommend the 'Customer Support QA' dataset combined with Hallucination Rate, Toxicity Score, and Refusal Rate metrics."
        };
        break;
      
      case "code_eval":
        recommendation = {
          dataset: allDatasets.find(d => d.id === "ds-002") || allDatasets[1], // HumanEval
          metrics: allMetrics.filter(m => ["met-007", "met-016", "met-001"].includes(m.id)), // Code Exec, SQL Syntax, Exact Match
          agent: allAgents.find(a => a.id === "ag-002") || allAgents[1],
          scenario: allScenarios.find(s => s.id === "scn-003") || allScenarios[2], // Code Gen
          reason: "To evaluate coding ability, 'HumanEval' is the industry standard. We've selected execution-based metrics to verify correctness."
        };
        break;

      case "rag_accuracy":
        recommendation = {
          dataset: allDatasets.find(d => d.id === "ds-001") || allDatasets[0],
          metrics: allMetrics.filter(m => ["met-010", "met-011", "met-004"].includes(m.id)), // Context Adherence, Relevance, Hallucination
          agent: allAgents.find(a => a.id === "ag-001") || allAgents[0],
          scenario: allScenarios.find(s => s.id === "scn-002") || allScenarios[1], // RAG Accuracy
          reason: "For RAG accuracy, we focus on Context Adherence and Relevance metrics using a standard QA dataset."
        };
        break;
        
      case "general_chat":
        recommendation = {
          dataset: allDatasets.find(d => d.id === "ds-007") || allDatasets[6], // Creative Writing
          metrics: allMetrics.filter(m => ["met-011", "met-012", "met-015"].includes(m.id)), // Relevance, Coherence, Tone
          agent: allAgents.find(a => a.id === "ag-003") || allAgents[2],
          scenario: allScenarios.find(s => s.id === "scn-001") || allScenarios[0], // General Chat
          reason: "For general conversation, we recommend evaluating Relevance, Coherence, and Tone Consistency."
        };
        break;
    }

    return recommendation;
  }
};
