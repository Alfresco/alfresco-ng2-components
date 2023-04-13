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

import { setupTestBed } from '@alfresco/adf-core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { PermissionContainerComponent } from './permission-container.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('PermissionContainerComponent', () => {

    let fixture: ComponentFixture<PermissionContainerComponent>;
    let component: PermissionContainerComponent;
    let element: HTMLElement;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
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
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Should render the layout with details', () => {
        expect(element.querySelectorAll('.adf-datatable-permission .adf-datatable-row').length).toBe(2);
        expect(element.querySelector('adf-user-name-column').textContent).toContain('GROUP_EVERYONE');
        expect(element.querySelector('#adf-select-role-permission').textContent).toContain('consumer');
    });

    it('should emit update event on  role change', () => {
        spyOn(component.update, 'emit');

        const selectBox = fixture.debugElement.query(By.css(('[id="adf-select-role-permission"] .mat-select-trigger')));
        selectBox.triggerEventHandler('click', null);
        fixture.detectChanges();

        const options = fixture.debugElement.queryAll(By.css('mat-option'));
        expect(options).not.toBeNull();
        expect(options.length).toBe(2);
        options[0].triggerEventHandler('click', {});
        fixture.detectChanges();
        expect(component.update.emit).toHaveBeenCalledWith({ role: 'Test', permission: component.permissions[0] });
    });

    it('should delete update event on row delete', () => {
        spyOn(component.delete, 'emit');
        const deleteButton: HTMLButtonElement = element.querySelector('[data-automation-id="adf-delete-permission-button-GROUP_EVERYONE"]');
        deleteButton.click();
        fixture.detectChanges();
        expect(component.delete.emit).toHaveBeenCalledWith(component.permissions[0]);
    });
});
