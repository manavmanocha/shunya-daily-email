import { IDataSet } from './data-set';
export declare namespace Utils {
    function scaleValueBetween0And1(value: number, minAndMax: {
        min: number;
        max: number;
    }, type: string): number;
    function findMinAndMax(values: number[]): {
        min: number;
        max: number;
    };
    function findMiddleOfMinAndMax(values: number[]): number;
    function getDefaultXAxis(dataSets: IDataSet[]): number[];
    function ensureDataSetsHaveSameXValues(dataSets: IDataSet[]): void;
    function divideXAxisToN(n: number, dataSets: IDataSet[]): any[];
}
