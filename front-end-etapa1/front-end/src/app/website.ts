import { Webpage } from './webpage';

export interface Website {
    _id: string;
    url: string;
    avaliacao: AvaliacaoStatus;
    dataDeRegisto: Date;
    dataDaUltimaAvaliacao: Date;
    webpages: Webpage[];
}

export enum AvaliacaoStatus {
    PorAvaliar = 'Por avaliar',
    EmAvaliacao = 'Em avaliação',
    Avaliado = 'Avaliado',
    ErroNaAvaliacao = 'Erro na avaliação'
}