import { OnChanges, OnInit } from '@angular/core';
import { IChartStyle } from '../chart-style';
import { IDataSet } from '../data-set';
export declare class LineChartComponent implements OnInit, OnChanges {
    xAxisValues: number[] | number;
    dataSets: IDataSet[];
    style: IChartStyle;
    _xAxisValues: any;
    xLabelFunction: (value: number) => string;
    yLabelFunction: (value: number) => string;
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    private update();
    private applyDefaultStyle();
}
