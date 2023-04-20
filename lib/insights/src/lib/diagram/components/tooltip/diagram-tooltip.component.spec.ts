/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DiagramTooltipComponent } from './diagram-tooltip.component';
import { setupTestBed } from '@alfresco/adf-core';

@Component({
    template: `
        <div id="diagram-element-id">Hover me</div>
        <diagram-tooltip [data]="data"></diagram-tooltip>`
})
class TestHostComponent {
    data = {
        id: 'diagram-element-id'
    };
}

describe('DiagramTooltipComponent', () => {

    describe('Template', () => {

        let fixture: ComponentFixture<DiagramTooltipComponent>;
        let component: DiagramTooltipComponent;
        let data;

        setupTestBed({
            declarations: [DiagramTooltipComponent]
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(DiagramTooltipComponent);
            component = fixture.componentInstance;
            data = {
                type: 'awesome-diagram-element',
                name: 'diagram-element-name',
                id: 'diagram-element-id',
                properties: []
            };
            component.data = data;
            fixture.detectChanges();
        });

        it('should render with type and name if name is defined', () => {
            const tooltipHeader = fixture.debugElement.query(By.css('.adf-diagram-tooltip-header'));

            expect(tooltipHeader.nativeElement.innerText).toBe('awesome-diagram-element diagram-element-name');
        });

        it('should render with type and id if name is NOT defined', () => {
            data.name = '';
            fixture.detectChanges();

            const tooltipHeader = fixture.debugElement.query(By.css('.adf-diagram-tooltip-header'));

            expect(tooltipHeader.nativeElement.innerText).toBe('awesome-diagram-element diagram-element-id');
        });

        it('should render the name if name is defined in the tooltip body', () => {
            const nameProperty = fixture.debugElement.query(By.css('.adf-diagram-name-property'));

            expect(nameProperty).not.toBeNull();
            expect(nameProperty.nativeElement.innerText).toBe('Name:diagram-element-name');
        });

        it('should NOT render the name if name is NOT defined in the tooltip body', () => {
            data.name = '';
            fixture.detectChanges();

            const nameProperty = fixture.debugElement.query(By.css('.adf-diagram-name-property'));

            expect(nameProperty).toBeNull();
        });

        it('should render the properties, if there is any', () => {
            data.properties = [
                {name: 'property-1-name', value: 'property-1-value'},
                {name: 'property-2-name', value: 'property-2-value'}
            ];
            fixture.detectChanges();

            const propertyNames = fixture.debugElement.queryAll(By.css('.adf-diagram-general-property > .adf-diagram-propertyName'));
            const propertyValues = fixture.debugElement.queryAll(By.css('.adf-diagram-general-property > .adf-diagram-propertyValue'));

            expect(propertyNames.length).toBe(2);
            expect(propertyValues.length).toBe(2);
            expect(propertyNames[0].nativeElement.innerText).toBe('property-1-name:');
            expect(propertyNames[1].nativeElement.innerText).toBe('property-2-name:');
            expect(propertyValues[0].nativeElement.innerText).toBe('property-1-value');
            expect(propertyValues[1].nativeElement.innerText).toBe('property-2-value');
        });

        it('should render value and data type', () => {
            data.value = '1';
            data.dataType = 'hour';

            fixture.detectChanges();

            const propertyValue = fixture.debugElement.queryAll(By.css('.adf-diagram-heat-value > .adf-diagram-value'));
            const propertyValueType = fixture.debugElement.queryAll(By.css('.adf-diagram-heat-value > .adf-diagram-valuetype'));

            expect(propertyValue.length).toBe(1);
            expect(propertyValueType.length).toBe(1);
            expect(propertyValue[0].nativeElement.innerText).toBe('1');
            expect(propertyValueType[0].nativeElement.innerText).toBe(' hour');
        });
    });

    describe('Tooltip functionality', () => {

        let fixture: ComponentFixture<TestHostComponent>;

        setupTestBed({
            declarations: [DiagramTooltipComponent, TestHostComponent]
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestHostComponent);

            fixture.detectChanges();
        });

        it('should NOT show the tooltip by default', () => {
            const tooltip = fixture.debugElement.query(By.css('.adf-diagram-tooltip.adf-is-active'));

            expect(tooltip).toBeNull();
        });

        it('should show the tooltip on hovering the target element', () => {
            const tooltipTarget = fixture.debugElement.query(By.css('#diagram-element-id'));

            tooltipTarget.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));

            const tooltip = fixture.debugElement.query(By.css('.adf-diagram-tooltip.adf-is-active'));
            expect(tooltip).not.toBeNull();
        });

        it('should show the tooltip on touchend the target element', () => {
            const tooltipTarget = fixture.debugElement.query(By.css('#diagram-element-id'));

            tooltipTarget.nativeElement.dispatchEvent(new MouseEvent('touchend'));

            const tooltip = fixture.debugElement.query(By.css('.adf-diagram-tooltip.adf-is-active'));
            expect(tooltip).not.toBeNull();
        });

        it('should hide the tooltip on leaving the target element', () => {
            const tooltipTarget = fixture.debugElement.query(By.css('#diagram-element-id'));

            tooltipTarget.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            tooltipTarget.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));

            const tooltip = fixture.debugElement.query(By.css('.adf-diagram-tooltip.adf-is-active'));
            expect(tooltip).toBeNull();
        });

        it('should hide the tooltip on windows\'s scroll element', () => {
            const tooltipTarget = fixture.debugElement.query(By.css('#diagram-element-id'));

            tooltipTarget.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
            window.dispatchEvent(new CustomEvent('scroll'));

            const tooltip = fixture.debugElement.query(By.css('.adf-diagram-tooltip.adf-is-active'));
            expect(tooltip).toBeNull();
        });

        it('should hide the tooltip on windows\'s touchstart element', () => {
            const tooltipTarget = fixture.debugElement.query(By.css('#diagram-element-id'));

            tooltipTarget.nativeElement.dispatchEvent(new MouseEvent('touchend'));
            window.dispatchEvent(new CustomEvent('touchstart'));

            const tooltip = fixture.debugElement.query(By.css('.adf-diagram-tooltip.adf-is-active'));
            expect(tooltip).toBeNull();
        });
    });
});
