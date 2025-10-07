import {
  GetQuestionsRequest,
  QuestionResponse,
  RiskCalculationRequest,
} from "../types";

export const QuestionnaireService = {
  async GetQuestions(language: GetQuestionsRequest): Promise<QuestionResponse[]> {
    try {
      console.log("Fetching questions for language:", language.language);
      
      const response = await fetch(
        `/api/questionnaire?language=${language.language}`,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      throw error;
    }
  },

  async CalculateRisk(request: RiskCalculationRequest): Promise<string> {
    try {
      const response = await fetch('/api/calculate-risk', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the result field from the response
      // Handle both direct string responses and object responses with result field
      if (typeof data === 'string') {
        return data;
      } else if (data && typeof data.result === 'string') {
        return data.result;
      } else {
        console.warn('Unexpected response format:', data);
        return String(data);
      }
    } catch (error) {
      console.error("Failed to calculate risk:", error);
      throw error;
    }
  },

  async SubmitRiskResult(ssn: string, riskResult: string): Promise<void> {
    try {
      const riskRequestBody = { ssn, riskResult };
      
      const response = await fetch('/api/submit-risk', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(riskRequestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // No need to return data for this endpoint
    } catch (error) {
      console.error("Failed to submit risk result:", error);
      throw error;
    }
  }
};

export type { GetQuestionsRequest, QuestionResponse, RiskCalculationRequest };