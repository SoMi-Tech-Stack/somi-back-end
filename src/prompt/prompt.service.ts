import { Injectable } from '@nestjs/common';
import {
  PromptTemplate,
  PromptVariableMap,
  PromptConfig,
  GeneratedPrompt,
} from './prompt.types';

@Injectable()
export class PromptService {
  generatePrompt(
    template: PromptTemplate,
    variables: PromptVariableMap,
    config: Partial<PromptConfig> = {},
  ): GeneratedPrompt {
    let prompt = template.template;

    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    if (template.examples?.length) {
      prompt += '\n\nExamples:\n';
      template.examples.forEach((ex, i) => {
        prompt += `\nExample ${i + 1}:\nInput: ${JSON.stringify(ex.input)}\nOutput: ${ex.output}\n`;
      });
    }

    if (template.constraints?.length) {
      prompt += '\n\nConstraints:\n';
      template.constraints.forEach((c) => {
        prompt += `- ${c}\n`;
      });
    }

    if (template.format) {
      prompt += `\nProvide the response in ${template.format} format.`;
    }

    prompt += `\n\nReturn a slightly different suggestion every time for variety.`;

    const defaultConfig: PromptConfig = {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      ...config,
    };

    return {
      prompt,
      config: defaultConfig,
      yearGroup: variables.yearGroup,
      theme: variables.theme,
    };
  }
}
