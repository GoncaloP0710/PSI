export interface Webpage {
  _id: string;
  url: string;
  dataDaUltimaAvaliacao: Date;
  isCompliant: 'Conforme' | 'Não conforme'; // Change this to match the backend
  A: number,
  AA: number,
  AAA: number,
  //test: { type: Schema.Types.ObjectId, ref: "Errortest", required: false },
  passed: number,
  inapplicable: number,
  warning: number,
  failed: number,
  percentagePassed: number,
  percentageInapplicable: number,
  percentageWarning: number,
  percentageFailed: number,
}