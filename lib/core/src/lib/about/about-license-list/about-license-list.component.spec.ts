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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutLicenseListComponent } from '@alfresco/adf-core';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader, HarnessPredicate } from '@angular/cdk/testing';
import { MatCellHarness } from '@angular/material/table/testing';

describe('AboutLicenseListComponent', () => {
    let fixture: ComponentFixture<AboutLicenseListComponent>;
    let component: AboutLicenseListComponent;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AboutLicenseListComponent]
        });
        fixture = TestBed.createComponent(AboutLicenseListComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    describe('Property value', () => {
        let valueCellHarnessPredicate: HarnessPredicate<MatCellHarness>;

        const innerTextPropertyName = 'innerText';

        beforeEach(() => {
            component.data = [
                {
                    property: 'Test Property',
                    value: '&#9989 Value 1'
                }
            ];
            valueCellHarnessPredicate = MatCellHarness.with({
                columnName: 'value'
            });
        });

        it('should display correct value when contains green check mark icon', async () => {
            fixture.detectChanges();
            expect(await (await (await loader.getHarness(valueCellHarnessPredicate)).host()).getProperty(innerTextPropertyName)).toEqual(
                '✅ ABOUT.LICENSE.ENABLED Value 1'
            );
        });

        it('should display correct value when contains red cross icon', async () => {
            component.data[0].value = '&#10060 Value 1';

            fixture.detectChanges();
            expect(await (await (await loader.getHarness(valueCellHarnessPredicate)).host()).getProperty(innerTextPropertyName)).toEqual(
                '❌ ABOUT.LICENSE.DISABLED Value 1'
            );
        });

        it('should display correct value when contains no icon', async () => {
            component.data[0].value = 'Value 1';

            fixture.detectChanges();
            expect(await (await (await loader.getHarness(valueCellHarnessPredicate)).host()).getProperty(innerTextPropertyName)).toEqual('Value 1');
        });

        it('should display correct value when there is number value', async () => {
            component.data[0].value = 3;

            fixture.detectChanges();
            expect(await (await (await loader.getHarness(valueCellHarnessPredicate)).host()).getProperty(innerTextPropertyName)).toEqual('3');
        });
    });
});
