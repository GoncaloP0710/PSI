import { Webpage } from './webpage';

export interface Website {
    _id: string;
    url: string;
    avaliacao: AvaliacaoStatus;
    dataDeRegisto: Date;
    dataDaUltimaAvaliacao: Date;
    webpages: Webpage[];
    countA: string,
    countAA: string,
    countAAA: string,
    topTenErrors: String,
    percentageCountA: string,
    percentageCountAA: string,
    percentageCountAAA: string,
    countAny: string,
    countNone: string,
    percentageNone: string,
    percentageAny: string
}

export enum AvaliacaoStatus {
    PorAvaliar = 'Por avaliar',
    EmAvaliacao = 'Em avaliação',
    Avaliado = 'Avaliado',
    ErroNaAvaliacao = 'Erro na avaliação'
}