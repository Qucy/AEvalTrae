export interface Dataset {
  id: string;
  name: string;
  description: string;
  tags: string[];
  size: string;
}

export interface Metric {
  id: string;
  name: string;
  category: string;
  description: string;
  cost: "Low" | "Medium" | "High";
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  recommended_metrics: string[]; // metric IDs
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  description: string;
  capabilities: string[];
}

export interface Recommendation {
  dataset: Dataset;
  metrics: Metric[];
  agent: Agent;
  scenario: Scenario;
  reason: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "system";
  content: string;
  timestamp: number;
  recommendation?: Recommendation;
  quickReplies?: string[];
}
