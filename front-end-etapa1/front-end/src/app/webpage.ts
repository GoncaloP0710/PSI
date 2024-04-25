export interface WebPage {
    url: string;
    lastEvaluationDate: Date;
    isCompliant: boolean; // true if no accessibility errors of level A and AA, false otherwise
  }