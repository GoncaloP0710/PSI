export interface Webpage {
  _id: string;
  url: string;
  dataDaUltimaAvaliacao: Date;
  isCompliant: 'Conforme' | 'Não conforme'; // Change this to match the backend
}