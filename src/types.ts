export interface AnswerResponse {
  id: number;
  answer: string;
}
 
export interface QuestionResponse {
  id: number;
  question: string;
  order: number;
  answers: AnswerResponse[];
}
 
export interface FormDataRequest {
  clientName: string;
  ssn: string;
  [key: string]: string;
  result: string;
}
 
export interface GetQuestionsRequest {
  language: string;
}
 
export interface RiskCalculationRequest {
  ssn: string;
  selections: Array<{
    questionId: number;
    answerId: number;
  }>;
}
 
export interface QuestionAnswers {
  question: string;
  answer: string;
}

export interface FormData {
  clientName: string;
  ssn: string;
  [key: string]: string;
}

export interface FundData {
  fundId: string;
  name: string;
}

export interface FundDataPoint {
  fundId: string;
  date: string;
  unitPrice: number;
}

export interface FundDataApiResponse {
  fundId: string;
  dataPoints: FundDataPoint[];
}

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export interface FundDataParams {
  fundId: string;
  dateFrom: string;
  dateTo: string;
  languageId?: string;
}