(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('deepmerge')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/common', '@angular/core', 'deepmerge'], factory) :
	(factory((global['ngx-line-chart'] = {}),global._angular_common,global._angular_core,global.deepmerge));
}(this, (function (exports,_angular_common,_angular_core,deepmerge) { 'use strict';

deepmerge = deepmerge && deepmerge.hasOwnProperty('default') ? deepmerge['default'] : deepmerge;

var Utils;
(function (Utils) {
    /**
     * @param {?} value
     * @param {?} minAndMax
     * @param {?} type
     * @return {?}
     */
    function scaleValueBetween0And1(value, minAndMax, type) {
        var /** @type {?} */ min = 0;
        if (type === 'x') {
            min = minAndMax.min;
        }
        var /** @type {?} */ divider = minAndMax.max - min;
        if (divider === 0) {
            return 0;
        }
        return (value - min) / divider;
    }
    Utils.scaleValueBetween0And1 = scaleValueBetween0And1;
    /**
     * @param {?} values
     * @return {?}
     */
    function findMinAndMax(values) {
        var /** @type {?} */ min = Math.min.apply(Math, values);
        var /** @type {?} */ max = Math.max.apply(Math, values);
        return { min: min, max: max };
    }
    Utils.findMinAndMax = findMinAndMax;
    /**
     * @param {?} values
     * @return {?}
     */
    function findMiddleOfMinAndMax(values) {
        var /** @type {?} */ minAndMax = findMinAndMax(values);
        return Math.floor((minAndMax.max - minAndMax.min) / 2 + minAndMax.min);
    }
    Utils.findMiddleOfMinAndMax = findMiddleOfMinAndMax;
    /**
     * @param {?} dataSets
     * @return {?}
     */
    function getDefaultXAxis(dataSets) {
        return dataSets[0].points.map(function (point) { return point.x; });
    }
    Utils.getDefaultXAxis = getDefaultXAxis;
    /**
     * @param {?} dataSets
     * @return {?}
     */
    function ensureDataSetsHaveSameXValues(dataSets) {
        if (dataSets.length === 1) {
            return;
        }
        var /** @type {?} */ error = new Error('Unfortunately the data sets need to have common, same-way ordered set of x values.'
            + ' If either data set is missing some point, provide it as null y value. Sorry for inconvenience');
        var /** @type {?} */ firstSetValues = dataSets[0].points.map(function (point) { return point.x; });
        var /** @type {?} */ secondSetValues = dataSets[1].points.map(function (point) { return point.x; });
        if (firstSetValues.length !== secondSetValues.length) {
            throw error;
        }
        for (var /** @type {?} */ i = 0; i < firstSetValues.length; ++i) {
            if (firstSetValues[i] !== secondSetValues[i]) {
                throw error;
            }
        }
    }
    Utils.ensureDataSetsHaveSameXValues = ensureDataSetsHaveSameXValues;
    /**
     * @param {?} n
     * @param {?} dataSets
     * @return {?}
     */
    function divideXAxisToN(n, dataSets) {
        var /** @type {?} */ points = dataSets[0].points;
        var /** @type {?} */ firstPointX = points[0].x;
        var /** @type {?} */ lastPointX = points[points.length - 1].x;
        var /** @type {?} */ result = [];
        result.push(firstPointX);
        var /** @type {?} */ range = lastPointX - firstPointX;
        for (var /** @type {?} */ i = 1; i < n - 1; ++i) {
            result.push(range / (n - 1) * i + firstPointX);
        }
        result.push(lastPointX);
        return result;
    }
    Utils.divideXAxisToN = divideXAxisToN;
})(Utils || (Utils = {}));

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var ChartComponent = (function () {
    function ChartComponent() {
        this.width = 800;
        this.height = 500;
        this.padding = 100;
    }
    /**
     * @param {?} setIndex
     * @return {?}
     */
    ChartComponent.prototype.getYAxisValues = function (setIndex) {
        if (setIndex >= this.dataSets.length) {
            return [];
        }
        var /** @type {?} */ scaledPoints = this.getScaledPoints(this.dataSets[setIndex].points)
            .sort(function (a, b) { return a.originalY - b.originalY; });
        var /** @type {?} */ min = scaledPoints[0];
        var /** @type {?} */ mid = scaledPoints[Math.floor(scaledPoints.length / 2)];
        var /** @type {?} */ max = scaledPoints[scaledPoints.length - 1];
        var /** @type {?} */ midLabelValue = Utils.findMiddleOfMinAndMax(this.dataSets[setIndex].points.map(function (point) { return point.y; }));
        if (max.y === min.y) {
            midLabelValue = 0.5;
            mid.y = 0.5;
            mid.originalY = 0.5;
            max.y = this.padding;
            max.originalY = 1;
        }
        return [
            {
                label: this.getYLabel(0),
                y: this.height - this.padding
            },
            __assign({}, mid, { label: this.getYLabel(midLabelValue), y: this.height / 2 }),
            __assign({}, max, { label: this.getYLabel(max.originalY) })
        ];
    };
    /**
     * @return {?}
     */
    ChartComponent.prototype.getXAxisValues = function () {
        var _this = this;
        return this.getScaledPoints(this.xAxisValues.map(function (value) { return ({ x: value, y: 0 }); }))
            .map(function (scaledPoint) { return ({
            label: _this.getXLabel(scaledPoint.originalX),
            x: scaledPoint.x
        }); });
    };
    /**
     * @param {?} scaledCoordinates
     * @return {?}
     */
    ChartComponent.prototype.pointsToPath = function (scaledCoordinates) {
        var /** @type {?} */ startPoint = scaledCoordinates[0];
        var /** @type {?} */ startPointMove = "M " + startPoint.x + " " + startPoint.y;
        var /** @type {?} */ path = scaledCoordinates.slice(1).map(function (point) { return "L " + point.x + " " + point.y; }).join(' ');
        return startPointMove + " " + path;
    };
    /**
     * @param {?} points
     * @param {?=} asd
     * @return {?}
     */
    ChartComponent.prototype.getScaledPoints = function (points, asd) {
        var _this = this;
        if (asd === void 0) { asd = false; }
        var /** @type {?} */ minAndMaxX = Utils.findMinAndMax(points.map(function (point) { return point.x; }));
        var /** @type {?} */ minAndMaxY = Utils.findMinAndMax(points.map(function (point) { return point.y; }));
        return points.map(function (point) {
            var /** @type {?} */ scaledX = Utils.scaleValueBetween0And1(point.x, minAndMaxX, 'x');
            var /** @type {?} */ scaledY = Utils.scaleValueBetween0And1(point.y, minAndMaxY, 'y');
            return {
                originalX: point.x,
                originalY: point.y,
                x: scaledX * (_this.width - 2 * _this.padding) + _this.padding,
                y: _this.height - ((scaledY * (_this.height - 2 * _this.padding)) + _this.padding),
            };
        }).sort(function (a, b) { return a.originalX - b.originalX; });
    };
    /**
     * @param {?} x
     * @return {?}
     */
    ChartComponent.prototype.getXLabel = function (x) {
        return this.xLabelFunction ? this.xLabelFunction(x) : x;
    };
    /**
     * @param {?} y
     * @return {?}
     */
    ChartComponent.prototype.getYLabel = function (y) {
        return this.yLabelFunction ? this.yLabelFunction(y) : y;
    };
    ChartComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'ngx-chart',
                    styles: [".graph svg { width: 100%; height: 100%; } .graph .labels { stroke: #AFAFB1; } .graph .grid { stroke: #AFAFB1; stroke-dasharray: 0; stroke-width: 1; } .graph .data { fill: transparent; } "],
                    template: "<div class=\"chart\" xmlns:svg=\"http://www.w3.org/1999/XSL/Transform\"> <div class=\"graph\"> <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" [attr.viewBox]=\"'0 0 ' + width + ' ' + height\"> <svg:g class=\"grid y-grid\"> <svg:line [attr.x1]=\"padding\" [attr.x2]=\"width - padding\" [attr.y1]=\"height - padding\" [attr.y2]=\"height - padding\"></svg:line> </svg:g> <svg:g class=\"labels labels-x\"> <svg:line [attr.x1]=\"value.x\" [attr.x2]=\"value.x\" [attr.y1]=\"height - padding\" [attr.y2]=\"height - padding + 10\" *ngFor=\"let value of getXAxisValues()\"></svg:line> <svg:text [attr.y]=\"height - padding + 30\" [attr.x]=\"value.x - 20\" [attr.stroke]=\"style.xAxis.labels.color\" [attr.fill]=\"style.xAxis.labels.color\" [attr.font-size]=\"style.xAxis.labels.fontSize\" [attr.transform]=\"'rotate(' + style.xAxis.labels.angle + ',' + (value.x - 20) + ',' + (height - padding + 30) + ')'\" *ngFor=\"let value of getXAxisValues()\"> {{value.label}} </svg:text> </svg:g> <svg:g class=\"labels labels-y\"> <svg:text [attr.x]=\"padding - 30\" [attr.y]=\"value.y + 4\" [attr.stroke]=\"style.dataSetStyles[0].labels.yAxis.color\" [attr.fill]=\"style.dataSetStyles[0].labels.yAxis.color\" [attr.font-size]=\"style.dataSetStyles[0].labels.yAxis.fontSize\" *ngFor=\"let value of getYAxisValues(0)\">{{value.label}} </svg:text> <svg:line [attr.x1]=\"padding\" [attr.x2]=\"width - padding\" [attr.y1]=\"value.y\" [attr.y2]=\"value.y\" *ngFor=\"let value of getYAxisValues(0)\"></svg:line> </svg:g> <svg:g class=\"labels labels-y\"> <svg:text [attr.x]=\"width - padding + 10\" [attr.y]=\"value.y + 4\" [attr.stroke]=\"style.dataSetStyles[1].labels.yAxis.color\" [attr.fill]=\"style.dataSetStyles[1].labels.yAxis.color\" [attr.font-size]=\"style.dataSetStyles[1].labels.yAxis.fontSize\" *ngFor=\"let value of getYAxisValues(1)\">{{value.label}} </svg:text> </svg:g> <svg:g class=\"data\" [id]=\"'set-' + (i + 1)\" *ngFor=\"let set of dataSets; let i = index\"> <svg:circle [attr.cx]=\"point.x\" [attr.cy]=\"point.y\" [attr.data-value]=\"point.y\" [attr.stroke]=\"style.dataSetStyles[i].circle.color\" [attr.fill]=\"style.dataSetStyles[i].circle.color\" [attr.r]=\"style.dataSetStyles[i].circle.radius\" *ngFor=\"let point of getScaledPoints(set.points)\"></svg:circle> <svg:text [attr.y]=\"point.y - 14\" [attr.x]=\"point.x - 10\" [attr.stroke]=\"style.dataSetStyles[i].labels.value.color\" [attr.fill]=\"style.dataSetStyles[i].labels.value.color\" [attr.font-size]=\"style.dataSetStyles[i].labels.value.fontSize\" *ngFor=\"let point of getScaledPoints(set.points)\"> {{yLabelFunction(point.originalY)}} </svg:text> <svg:path [attr.stroke-width]=\"style.dataSetStyles[i].line.width\" [attr.stroke]=\"style.dataSetStyles[i].line.color\" [attr.d]=\"pointsToPath(getScaledPoints(set.points))\"></svg:path> </svg:g> </svg> </div> </div> "
                },] },
    ];
    /**
     * @nocollapse
     */
    ChartComponent.ctorParameters = function () { return []; };
    ChartComponent.propDecorators = {
        'dataSets': [{ type: _angular_core.Input },],
        'xAxisValues': [{ type: _angular_core.Input },],
        'xLabelFunction': [{ type: _angular_core.Input },],
        'yLabelFunction': [{ type: _angular_core.Input },],
        'style': [{ type: _angular_core.Input },],
    };
    return ChartComponent;
}());

var defaultStyle = {
    dataSetStyles: [
        {
            circle: {
                color: '#0051BA',
                radius: 4
            },
            labels: {
                value: {
                    color: '#0051BA',
                    fontSize: 14
                },
                yAxis: {
                    color: '#0051BA',
                    fontSize: 14
                }
            },
            line: {
                color: 'rgba(0, 81, 186, 0.4)',
                width: 5
            }
        },
        {
            circle: {
                color: '#1F1F21',
                radius: 4
            },
            labels: {
                value: {
                    color: '#1F1F21',
                    fontSize: 14
                },
                yAxis: {
                    color: '#575759',
                    fontSize: 14
                }
            },
            line: {
                color: 'rgba(87, 87, 89, 0.4)',
                width: 5
            }
        }
    ],
    xAxis: {
        labels: {
            color: '#8C8C8E',
            fontSize: 18,
            angle: 60
        }
    }
};

var LineChartComponent = (function () {
    function LineChartComponent() {
        this.style = {};
        this.xLabelFunction = function (value) { return value.toString(); };
        this.yLabelFunction = function (value) { return value.toString(); };
    }
    /**
     * @return {?}
     */
    LineChartComponent.prototype.ngOnInit = function () {
        this.update();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    LineChartComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        this.update();
        this.dataSets.forEach(function (dataSet, index) {
            var /** @type {?} */ dataSetProxy = new Proxy(dataSet, {
                set: function (target, prop, value) {
                    target[prop] = value;
                    _this.update();
                    return true;
                }
            });
            _this.dataSets[index] = dataSetProxy;
        });
    };
    /**
     * @return {?}
     */
    LineChartComponent.prototype.update = function () {
        if (!this.dataSets || this.dataSets.length === 0) {
            throw new Error('No data sets specified.');
        }
        if (this.dataSets.length > 2) {
            throw new Error('Only one or two data sets allowed.');
        }
        Utils.ensureDataSetsHaveSameXValues(this.dataSets);
        if (!this.xAxisValues) {
            this._xAxisValues = Utils.getDefaultXAxis(this.dataSets);
        }
        else if (typeof this.xAxisValues === 'number') {
            if (this.xAxisValues < 2) {
                throw new Error('xAxisValue can\'t be less than 2 since min and max are required at least for x-axis.');
            }
            this._xAxisValues = Utils.divideXAxisToN(this.xAxisValues, this.dataSets);
        }
        else {
            this._xAxisValues = this.xAxisValues.slice();
        }
        this.applyDefaultStyle();
    };
    /**
     * @return {?}
     */
    LineChartComponent.prototype.applyDefaultStyle = function () {
        this.style = deepmerge(defaultStyle, this.style);
    };
    LineChartComponent.decorators = [
        { type: _angular_core.Component, args: [{
                    selector: 'ngx-line-chart',
                    styles: [".labels { text-align: center; } .labels .set { display: inline-block; margin-right: 10px; } .labels .set .color-indicator { display: inline-block; } .labels .set .name { vertical-align: text-bottom; } "],
                    template: "<div class=\"chart-container\"> <ngx-chart [dataSets]=\"dataSets\" [xAxisValues]=\"_xAxisValues\" [xLabelFunction]=\"xLabelFunction\" [yLabelFunction]=\"yLabelFunction\" [style]=\"style\"></ngx-chart> <div class=\"labels\"> <div class=\"set\" *ngFor=\"let dataSet of dataSets; let i = index\"> <svg width=\"34\" height=\"16\" viewBox=\"0 0 120 120\" class=\"color-indicator\" xmlns=\"http://www.w3.org/2000/svg\"> <svg:rect x=\"0\" y=\"30\" width=\"120\" height=\"60\" rx=\"16\" ry=\"16\" [attr.fill]=\"style.dataSetStyles[i].circle.color\"/> </svg> <span class=\"name\" [innerHTML]=\"dataSet.name\"></span> </div> </div> </div> "
                },] },
    ];
    /**
     * @nocollapse
     */
    LineChartComponent.ctorParameters = function () { return []; };
    LineChartComponent.propDecorators = {
        'xAxisValues': [{ type: _angular_core.Input },],
        'dataSets': [{ type: _angular_core.Input },],
        'style': [{ type: _angular_core.Input },],
        'xLabelFunction': [{ type: _angular_core.Input },],
        'yLabelFunction': [{ type: _angular_core.Input },],
    };
    return LineChartComponent;
}());

var NgxLineChartModule = (function () {
    function NgxLineChartModule() {
    }
    NgxLineChartModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    declarations: [ChartComponent, LineChartComponent],
                    exports: [LineChartComponent],
                    imports: [
                        _angular_common.CommonModule
                    ]
                },] },
    ];
    /**
     * @nocollapse
     */
    NgxLineChartModule.ctorParameters = function () { return []; };
    return NgxLineChartModule;
}());

exports.NgxLineChartModule = NgxLineChartModule;
exports.ChartComponent = ChartComponent;
exports.LineChartComponent = LineChartComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
