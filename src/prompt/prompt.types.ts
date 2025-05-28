export type PromptVariableMap = Record<string, string>;

export interface PromptTemplate {
  template: string;
  variables: Record<string, string>;
  examples?: {
    input: PromptVariableMap;
    output: string;
  }[];
  constraints?: string[];
  format?: string;
}

export interface PromptConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface GeneratedPrompt {
  prompt: string;
  config: PromptConfig;
  yearGroup: string;
  theme: string;
}
