export interface ErrorTest {

    actrules: testDetails[],

    wcagtechniques: testDetails[],

    url: string,
}
export interface testDetails {
    moduleName: string,
    errorCode: string,
    outcome: string,
    A: number,
    AA: number,
    AAA: number,
    resultsTupleList: testResult[],
}
export interface testResult {
    htmlCode: string,
    pointer: string
}