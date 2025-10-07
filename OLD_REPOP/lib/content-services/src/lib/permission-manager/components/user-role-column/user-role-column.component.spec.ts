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
import { UserRoleColumnComponent } from './user-role-column.component';
import { RoleModel } from '../../models/role.model';
import { By } from '@angular/platform-browser';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('UserRoleColumnComponent', () => {
    let component: UserRoleColumnComponent;
    let fixture: ComponentFixture<UserRoleColumnComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, UserRoleColumnComponent]
        });

        fixture = TestBed.createComponent(UserRoleColumnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should emit roleChanged event when a new role is selected', () => {
        spyOn(component.roleChanged, 'emit');
        const role: RoleModel = { role: 'admin', label: 'Admin' };
        component.roles = [role];
        fixture.detectChanges();

        const select = fixture.debugElement.query(By.css('.adf-role-selector'));
        select.triggerEventHandler('selectionChange', { value: role.role });

        expect(component.roleChanged.emit).toHaveBeenCalledWith(role.role);
    });

    it('should display readonly role value when readonly is true', () => {
        component.readonly = true;
        component.value = 'admin';
        component.i18nValue = 'ADF.ROLES.ADMIN';
        fixture.detectChanges();

        const span = fixture.debugElement.query(By.css('.adf-readonly-role'));
        expect(span.nativeElement.textContent.trim()).toBe('ADF.ROLES.ADMIN');
    });
});
