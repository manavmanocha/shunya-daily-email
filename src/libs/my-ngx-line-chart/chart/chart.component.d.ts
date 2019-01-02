import { IChartStyle } from '../chart-style';
import { IDataSet } from '../data-set';
import { IPoint } from '../point';
import { IScaledPoint } from '../scaled-point';
export declare class ChartComponent {
    dataSets: IDataSet[];
    xAxisValues: number[];
    xLabelFunction: (value: number) => string;
    yLabelFunction: (value: number) => string;
    style: IChartStyle;
    width: number;
    height: number;
    padding: number;
    getYAxisValues(setIndex: number): ({
        label: string | number;
        y: number;
    } | {
        label: string | number;
        y: number;
        x: number;
        originalX: number;
        originalY: number;
    })[];
    getXAxisValues(): {
        label: string | number;
        x: number;
    }[];
    pointsToPath(scaledCoordinates: IScaledPoint[]): string;
    getScaledPoints(points: IPoint[], asd?: boolean): IScaledPoint[];
    private getXLabel(x);
    private getYLabel(y);
}
