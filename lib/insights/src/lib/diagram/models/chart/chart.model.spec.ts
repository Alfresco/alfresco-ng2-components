/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Chart } from './chart.model';

describe('Chart Model', () => {
    describe('constructor', () => {
        it('should create with default values when no argument is provided', () => {
            const chart = new Chart();
            expect(chart.labels).toEqual([]);
            expect(chart.data).toEqual([]);
            expect(chart.datasets).toEqual([]);
            expect(chart.showDetails).toBe(false);
        });

        it('should populate properties from input object', () => {
            const chart = new Chart({
                id: '1',
                title: 'Test Chart',
                titleKey: 'KEY',
                labels: ['a', 'b'],
                data: [1, 2],
                datasets: [{ data: [1] }],
                showDetails: true,
                detailsTable: { key: 'value' },
                options: { responsive: true }
            });

            expect(chart.id).toBe('1');
            expect(chart.title).toBe('Test Chart');
            expect(chart.titleKey).toBe('KEY');
            expect(chart.labels).toEqual(['a', 'b']);
            expect(chart.data).toEqual([1, 2]);
            expect(chart.datasets).toEqual([{ data: [1] }]);
            expect(chart.showDetails).toBe(true);
            expect(chart.detailsTable).toEqual({ key: 'value' });
            expect(chart.options).toEqual({ responsive: true });
        });

        it('should convert type and set icon for pieChart', () => {
            const chart = new Chart({ type: 'pieChart' });
            expect(chart.type).toBe('pie');
            expect(chart.icon).toBe('pie_chart');
        });

        it('should convert type and set icon for barChart', () => {
            const chart = new Chart({ type: 'barChart' });
            expect(chart.type).toBe('bar');
            expect(chart.icon).toBe('equalizer');
        });

        it('should convert type and set icon for line', () => {
            const chart = new Chart({ type: 'line' });
            expect(chart.type).toBe('line');
            expect(chart.icon).toBe('show_chart');
        });

        it('should convert type and set icon for table', () => {
            const chart = new Chart({ type: 'table' });
            expect(chart.type).toBe('table');
            expect(chart.icon).toBe('web');
        });

        it('should convert type and set icon for multiBarChart', () => {
            const chart = new Chart({ type: 'multiBarChart' });
            expect(chart.type).toBe('multiBar');
            expect(chart.icon).toBe('poll');
        });

        it('should convert type and set icon for processDefinitionHeatMap', () => {
            const chart = new Chart({ type: 'processDefinitionHeatMap' });
            expect(chart.type).toBe('HeatMap');
            expect(chart.icon).toBe('share');
        });

        it('should convert type and set icon for masterDetailTable', () => {
            const chart = new Chart({ type: 'masterDetailTable' });
            expect(chart.type).toBe('masterDetailTable');
            expect(chart.icon).toBe('subtitles');
        });

        it('should default to table type for unknown types', () => {
            const chart = new Chart({ type: 'unknown' });
            expect(chart.type).toBe('table');
            expect(chart.icon).toBe('web');
        });
    });

    describe('hasData', () => {
        it('should return true when data is not empty', () => {
            const chart = new Chart({ data: [1, 2, 3] });
            expect(chart.hasData()).toBe(true);
        });

        it('should return false when data is empty', () => {
            const chart = new Chart({ data: [] });
            expect(chart.hasData()).toBe(false);
        });

        it('should return false when no data is provided', () => {
            const chart = new Chart();
            expect(chart.hasData()).toBe(false);
        });
    });

    describe('hasDatasets', () => {
        it('should return true when datasets is not empty', () => {
            const chart = new Chart({ datasets: [{ data: [1] }] });
            expect(chart.hasDatasets()).toBe(true);
        });

        it('should return false when datasets is empty', () => {
            const chart = new Chart({ datasets: [] });
            expect(chart.hasDatasets()).toBe(false);
        });
    });

    describe('hasZeroValues', () => {
        it('should return true when all data values are zero', () => {
            const chart = new Chart({ data: [0, 0, 0] });
            expect(chart.hasZeroValues()).toBe(true);
        });

        it('should return false when at least one value is non-zero', () => {
            const chart = new Chart({ data: [0, 1, 0] });
            expect(chart.hasZeroValues()).toBe(false);
        });

        it('should return false when data is empty', () => {
            const chart = new Chart({ data: [] });
            expect(chart.hasZeroValues()).toBe(false);
        });
    });
});
