export type RecommendationPriority = "High" | "Medium" | "Low";
export type RecommendationEffort = "Low" | "Medium" | "High";

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: RecommendationEffort;
  steps: string[];
}
