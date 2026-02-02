export interface Dataset {
  id: string;
  name: string;
  description: string;
  tags: string[];
  size: string;
  file_format: "csv" | "json" | "jsonl" | "txt" | "tmx";
  metadata_quality_score?: number;
  created_at?: string;
  application_context?: string;
  total_records?: number;
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

export interface DatasetDetail {
  id: string;
  dataset_id: string;
  input_data: any;
  output_data?: any;
  trajectory_data?: any;
  ground_truth_answer?: any;
  ground_truth_trajectory?: any;
  row_index: number;
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
