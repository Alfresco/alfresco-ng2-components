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
import { PermissionContainerComponent } from './permission-container.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('PermissionContainerComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<PermissionContainerComponent>;
    let component: PermissionContainerComponent;
    let element: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(PermissionContainerComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        component.permissions = [
            {
                authorityId: 'GROUP_EVERYONE',
                accessStatus: 'ALLOWED',
                isInherited: true,
                name: 'consumer',
                icon: null
            }
        ];

        component.roles = [
            {
                label: 'test',
                role: 'Test'
            },
            {
                label: 'consumr',
                role: 'Consumer'
            }
        ];

        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Should render the layout with details', () => {
        expect(element.querySelectorAll('.adf-datatable-permission .adf-datatable-row').length).toBe(2);
        expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_EVERYONE');
        expect(element.querySelector('#adf-select-role-permission').textContent).toContain('consumer');
    });

    it('should emit update event on  role change', async () => {
        spyOn(component.update, 'emit');

        const select = await loader.getHarness(MatSelectHarness.with({ ancestor: `#adf-select-role-permission` }));
        await select.open();

        const options = await select.getOptions();
        expect(options.length).toBe(2);
        await options[0].click();
        expect(component.update.emit).toHaveBeenCalledWith({ role: 'Test', permission: component.permissions[0] });
    });

    it('should delete update event on row delete', async () => {
        spyOn(component.delete, 'emit');
        const deleteButton = await loader.getHarness(
            MatButtonHarness.with({ selector: `[data-automation-id="adf-delete-permission-button-GROUP_EVERYONE"]` })
        );
        await deleteButton.click();
        expect(component.delete.emit).toHaveBeenCalledWith(component.permissions[0]);
    });
});
