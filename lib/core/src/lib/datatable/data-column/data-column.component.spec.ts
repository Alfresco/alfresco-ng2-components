/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataColumnComponent } from './data-column.component';

@Component({
    imports: [DataColumnComponent],
    template: `
        <data-column key="name">
            <ng-template />
        </data-column>
    `
})
class DirectTemplateHostComponent {
    @ViewChild(DataColumnComponent)
    dataColumn: DataColumnComponent;
}

@Component({
    imports: [DataColumnComponent],
    template: `
        <data-column key="name">
            <div>
                <ng-template />
            </div>
        </data-column>
    `
})
class NestedTemplateHostComponent {
    @ViewChild(DataColumnComponent)
    dataColumn: DataColumnComponent;
}

describe('DataColumnComponent', () => {
    it('should setup screen reader title for thumbnails', () => {
        const component = new DataColumnComponent();
        component.key = '$thumbnail';
        expect(component.srTitle).toBeFalsy();
        component.ngOnInit();
        expect(component.srTitle).toBeTruthy();
    });

    describe('template ContentChild selection', () => {
        let directFixture: ComponentFixture<DirectTemplateHostComponent>;
        let nestedFixture: ComponentFixture<NestedTemplateHostComponent>;

        it('should capture a direct ng-template child', () => {
            directFixture = TestBed.createComponent(DirectTemplateHostComponent);
            directFixture.detectChanges();

            expect(directFixture.componentInstance.dataColumn.template).toBeTruthy();
        });

        it('should not capture a nested descendant ng-template', () => {
            nestedFixture = TestBed.createComponent(NestedTemplateHostComponent);
            nestedFixture.detectChanges();

            expect(nestedFixture.componentInstance.dataColumn.template).toBeFalsy();
        });
    });
});
